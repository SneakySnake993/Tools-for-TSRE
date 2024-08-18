import React, { useState, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MapComponent from '../components/MapComponent';
import SearchBar from '../components/SearchBar';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner'; 
import CredentialsModal from '../components/CredentialsModal';
import PathSelector from '../components/PathSelector';
import { fetchRailwayDataJSON } from '../services/osmService';
import { convertJsonToGpx } from '../services/dataProcessingService';
import { saveGPXDataToFile, saveHGTDataToFile } from '../services/dataSavingService';
import { getBearerToken, fetchHGTFilesData } from '../services/nasaService';
import * as constants from '../constants';

import '../styles/App.css';

function App() {
  const [bounds, setBounds] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [credentialsModal, setCredentialsModal] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [tsrePath, setTsrePath] = useState('');
  const [routePath, setRoutePath] = useState('');
  const featureGroupRef = useRef(null);

  const handleAreaSelected = (area) => {
    setSelectedArea(area);
  };

  const handleSearch = async (locationName) => {
    const url = `${constants.NOMINATIM_API}?format=json&q=${encodeURIComponent(locationName)}&limit=1&polygon_geojson=1`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.length > 0) {
        const boundingBox = data[0].boundingbox;
        const bounds = [
          [parseFloat(boundingBox[0]), parseFloat(boundingBox[2])],
          [parseFloat(boundingBox[1]), parseFloat(boundingBox[3])]
        ];
        setBounds(bounds); // Set the map bounds without adjusting the zoom
      } else {
        setModal({ isOpen: true, title: constants.MESSAGE_TYPES.ERROR, message: constants.ERROR_MESSAGES.LOCATION_NOT_FOUND });
      }
    } catch (error) {
      console.error(constants.ERROR_MESSAGES.ERROR_FETCHING_LOCATION, error);
      setModal({ isOpen: true, title: constants.MESSAGE_TYPES.ERROR, message: constants.ERROR_MESSAGES.ERROR_FETCHING_LOCATION });
    }
  };

  const handleImportData = async () => {
    if (selectedArea) {
      setLoadingMessage(constants.INFO_MESSAGES.FETCHING_RAILWAY_DATA);
      setLoading(true);
      try {
        console.log('Starting import process');

        // Step 1: Fetch the railway data as JSON
        const rawData = await fetchRailwayDataJSON(selectedArea.northEast, selectedArea.southWest);

        // Step 2: Convert JSON data to GPX
        setLoadingMessage(constants.INFO_MESSAGES.CONVERTING_DATA_TO_GPX);
        const gpxData = convertJsonToGpx(rawData);

        // Step 3: Save the data to a file
        setLoadingMessage(constants.INFO_MESSAGES.SAVING_RAILWAY_DATA);
        let fileName = constants.DEFAULT_GPX_FILE_NAME;
        let filePath = '';
        if (routePath) {
          filePath = `${routePath}/${fileName}`;
        }
        
        const savedFilePath = await saveGPXDataToFile(filePath, fileName, gpxData);
        setLoading(false);
        
        if (savedFilePath) {
          setModal({ isOpen: true, title: constants.MESSAGE_TYPES.SUCCESS, message: `${constants.SUCCESS_MESSAGES.RAILWAY_TRACKS_SAVED} ${savedFilePath}` });
        }
      } catch (error) {
        console.error('Error during import process:', error);
        if (error.message !== "UserCancelled") {
          setModal({ isOpen: true, title: constants.MESSAGE_TYPES.ERROR, message: constants.ERROR_MESSAGES.FAILED_TO_FETCH_RAILWAY_TRACKS });
        }
      } finally {
        setLoading(false);
      }
    } else {
      setModal({ isOpen: true, title: constants.MESSAGE_TYPES.WARNING, message: constants.WARNING_MESSAGES.SELECT_AREA });
    }
  };

  async function handleImportHGTData() {
    if (selectedArea) {
      setLoadingMessage(constants.INFO_MESSAGES.FETCHING_TOPOGRAPHICAL_DATA);
      setLoading(true);
      try {
        // Vérifiez si un token est déjà stocké
        let token = localStorage.getItem('bearerToken');
        const expirationDate = localStorage.getItem('tokenExpirationDate');

        if (!token || new Date(expirationDate) < new Date()) {
          // Si le token est expiré ou n'existe pas, afficher le modal des credentials
          setCredentialsModal(true);
          return;
        }

        const hgtFilesFetchedDataList = await fetchHGTFilesData(selectedArea.northEast, selectedArea.southWest, token);
        setLoadingMessage(constants.INFO_MESSAGES.SAVING_TOPOGRAPHICAL_DATA);
        for (const hgtData of hgtFilesFetchedDataList) {
          const fileName = `${hgtData.name}.hgt`;
          let filePath = '';
          if (tsrePath) {
            filePath = tsrePath;
          }
          let savedFilePath = await saveHGTDataToFile(filePath, fileName, hgtData.data);

          if (savedFilePath) {
            setModal({ isOpen: true, title: constants.MESSAGE_TYPES.SUCCESS, message: `${constants.SUCCESS_MESSAGES.TOPOGRAHICAL_DATA_SAVED} ${savedFilePath}` });
          }
        }
        setLoading(false);

      } catch (error) {
        console.error('Error during HGT/DEM import process:', error.message);
        if (error.message !== 'UserCancelled') {
          setModal({ isOpen: true, title: constants.MESSAGE_TYPES.ERROR, message: constants.ERROR_MESSAGES.FAILED_TO_FETCH_HGT_DATA });
        }
      } finally {
        setLoading(false);
      }
    } else {
      setModal({
        isOpen: true,
        title: constants.MESSAGE_TYPES.WARNING,
        message: constants.WARNING_MESSAGES.SELECT_AREA,
      });
    }
  }
  

  const clearDrawings = () => {
    if (featureGroupRef.current) {
      featureGroupRef.current.clearLayers();
    }
    setSelectedArea(null); // Clear the selected area without resetting the map bounds
  };

  const onCreated = (e) => {
    const { layerType, layer } = e;
    if (layerType === 'rectangle') {
      //Clear existing layers before adding the new one
      if (featureGroupRef.current) {
        featureGroupRef.current.clearLayers();
      }

      const bounds = layer.getBounds();
      const area = {
        northEast: bounds.getNorthEast(),
        southWest: bounds.getSouthWest(),
      };
      setSelectedArea(area);

      // Add the new layer to the FeatureGroup
      featureGroupRef.current.addLayer(layer);

      console.log('Selected area coordinates:', area);
    }
  };

  const handleCredentialsSubmit = async (username, password) => {
    try {
      setLoginError(null);
      const tokenData = await getBearerToken(username, password);
      console.log('Token data:', tokenData);

      if (tokenData.access_token) {
        localStorage.setItem('bearerToken', tokenData.access_token);
        localStorage.setItem('tokenExpirationDate', new Date(tokenData.expiration_date).toISOString());
        setCredentialsModal(false);
        handleImportHGTData();
      }
      
    } catch (error) {
      console.error('Error during token retrieval:', error);
      setLoginError(constants.WARNING_MESSAGES.INVALID_CREDENTIALS);
    }
  };

  const handleOpenCredentialsModal = () => {
    setLoginError(null); // Clear any previous error
    setCredentialsModal(true); // Open the modal
  };

  return (
    <div className="app-container">
      <Header />
      
      <SearchBar onSearch={handleSearch} />
      <main className="app-main">
        <div className="map-container">
          <MapComponent
            bounds={bounds}
            onAreaSelected={handleAreaSelected}
            onCreated={onCreated}
            featureGroupRef={featureGroupRef}
          />
        </div>

        <div className="path-section">
          <PathSelector
            message={'Select TSRE Directory'}
            onChange={setTsrePath}
            placeholder="Select TSRE Path"
            value={tsrePath}
          />
          <PathSelector
            message={'Select Route Directory'}
            onChange={setRoutePath}
            placeholder="Select Route Path"
            value={routePath}
          />
        </div>

        <div className="import-section">
          <button
            onClick={handleImportData}
            className={`import-button ${selectedArea ? '' : 'disabled'}`}
          >
            Import Railway Data (GPX)
          </button>
          <button
            onClick={handleImportHGTData }
            className={`import-button ${selectedArea ? '' : 'disabled'}`}
          >
            Import Topography Data (HGT)
          </button>
          <button onClick={clearDrawings} className="clear-button">
            Clear Selected Area
          </button>
        </div>

      </main>
      <Footer />
      {loading && <LoadingSpinner message={loadingMessage}/>} {/* Affiche le spinner pendant le chargement */}
      <Modal 
        isOpen={modal.isOpen} 
        title={modal.title} 
        message={modal.message} 
        onClose={() => setModal({ isOpen: false, title: '', message: '' })} 
      />
      <CredentialsModal 
        isOpen={credentialsModal} 
        onClose={() => setCredentialsModal(false)} 
        onSubmit={handleCredentialsSubmit} 
        error={loginError}
      />
    </div>
  );
}

export default App;

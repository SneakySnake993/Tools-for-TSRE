import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, FeatureGroup, useMap } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import '../styles/index.css';
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '../constants';

const MapComponent = ({ bounds, onAreaSelected, onCreated, featureGroupRef }) => {
  const mapRef = useRef();
  const previousBounds = useRef(null); // Track previous bounds

  const FitBoundsComponent = ({ bounds }) => {
    const map = useMap();

    useEffect(() => {
      if (bounds && map && bounds !== previousBounds.current) {
        map.fitBounds(bounds); // Adjust the zoom level to fit the bounds
        previousBounds.current = bounds; // Update the previous bounds
      }
    }, [bounds, map]);

    return null;
  };

  return (
    <MapContainer
      style={{ height: '100%', width: '100%' }}
      zoom={DEFAULT_MAP_ZOOM}
      center={DEFAULT_MAP_CENTER}
      whenCreated={mapInstance => { mapRef.current = mapInstance; }}
    >
      <FitBoundsComponent bounds={bounds} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <FeatureGroup ref={featureGroupRef}>
        <EditControl
          position="topright"
          onCreated={onCreated}
          draw={{
            rectangle: {
              shapeOptions: {
                color: '#c45587',
                weight: 3,
              },
            },
            polyline: false,
            polygon: false,
            circle: false,
            marker: false,
            circlemarker: false,
          }}
          edit={{
            edit: false,
            remove: false,
          }}
        />
      </FeatureGroup>
    </MapContainer>
  );
};

export default MapComponent;

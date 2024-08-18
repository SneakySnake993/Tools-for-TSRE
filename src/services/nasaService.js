import { fetch, ResponseType } from '@tauri-apps/api/http';
import { NASA_HGT_FILE_URL, NASA_TOKEN_API } from '../constants';

export async function getBearerToken(username, password) {
  const authHeader = `Basic ${btoa(`${username}:${password}`)}`;
  
  const response = await fetch(NASA_TOKEN_API, {
    method: 'POST',
    headers: {
      Authorization: authHeader,
    },
    responseType: ResponseType.JSON,
  });

  if (response.ok) {
    return response.data;
  } else {
    throw new Error('Invalid credentials');
  }
}

async function fetchHGTFile(baseUrl, hgtFileName, token) {
  const url = `${baseUrl}${hgtFileName}.SRTMGL1.hgt.zip`;

  console.log(`Fetching HGT data from: ${url}`);

  return fetch(url, {
    method: 'GET',
    responseType: ResponseType.Binary,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function fetchHGTFilesData(northEast, southWest, token) {
  try {
    const baseUrl = NASA_HGT_FILE_URL;
    const hgtFilesList = generateHGTFileList(northEast, southWest);
    console.log('HGT files list:', hgtFilesList);
    const hgtFilesFetchedList = [];

    for (const hgtFileName of hgtFilesList) {
      const response = await fetchHGTFile(baseUrl, hgtFileName, token);
      console.log("Response", response.status);

      if (response.status !== 200) {
        throw new Error(`Failed to download HGT data: ${response.statusText}`);
      }
      hgtFilesFetchedList.push({ name: hgtFileName, data: response.data });
    }
    return hgtFilesFetchedList;

  } catch (error) {
    console.error('Error during HGT file download:', error);
    throw error;
  }
}

function generateHGTFileList(northEast, southWest) {
  const latStart = Math.floor(southWest.lat);
  const latEnd = Math.floor(northEast.lat);
  const lonStart = Math.floor(southWest.lng);
  const lonEnd = Math.floor(northEast.lng);

  const hgtFiles = [];

  for (let lat = latStart; lat <= latEnd; lat++) {
    for (let lon = lonStart; lon <= lonEnd; lon++) {
      const latPrefix = lat >= 0 ? 'N' : 'S';
      const lonPrefix = lon >= 0 ? 'E' : 'W';

      const hgtFileName = `${latPrefix}${Math.abs(lat).toString().padStart(2, '0')}${lonPrefix}${Math.abs(lon).toString().padStart(3, '0')}`;
      hgtFiles.push(hgtFileName);
    }
  }

  return hgtFiles;
}
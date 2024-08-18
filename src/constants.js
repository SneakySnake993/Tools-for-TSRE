// GLOBAL
export const ACCEPT_LANGUAGE = 'en-US,en;q=0.9';

// MAP
export const DEFAULT_MAP_CENTER = [50.8503, 4.3517];
export const DEFAULT_MAP_ZOOM = 8;

// API'S
export const NOMINATIM_API = 'https://nominatim.openstreetmap.org/search';
export const TILE_LAYER_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
export const TILE_LAYER_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// NASA SERVICES
export const NASA_TOKEN_API = 'https://urs.earthdata.nasa.gov/api/users/find_or_create_token';
export const NASA_HGT_FILE_URL = 'https://e4ftl01.cr.usgs.gov/MEASURES/SRTMGL1.003/2000.02.11/';

// DEFAULT FILE NAMES
export const DEFAULT_GPX_FILE_NAME = 'railway_tracks.gpx';
export const DEFAULT_HGT_FILE_NAME = 'elevation.hgt';

// DEFAULT GPX HEADER
export const DEFAULT_GPX_HEADER = `<?xml version="1.0" encoding="UTF-8"?>
<gpx xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <desc>Converted OSM data to GPX</desc>
    <time>${new Date().toISOString()}</time>
  </metadata>`;
export const DEFAULT_GPX_FOOTER = `
</gpx>`;

// MESSAGES TYPES
export const MESSAGE_TYPES = {
  ERROR: 'Error',
  WARNING: 'Warning',
  SUCCESS: 'Success',
  INFO: 'Info',
};

// ERROR MESSAGES
export const ERROR_MESSAGES = {
  LOCATION_NOT_FOUND: 'Location not found. Please try another search.',
  ERROR_FETCHING_LOCATION: 'Error fetching location. Please try again.',

  FAILED_TO_FETCH_RAILWAY_TRACKS: 'Failed to fetch railway GPX tracks. Please try again.',
  FAILED_TO_FETCH_HGT_DATA: 'Failed to fetch elevation data. Please try again.',
  FAILED_TO_SAVE_GPX_FILE: 'Failed to save GPX file.',
  FAILED_TO_SAVE_HGT_FILE: 'Failed to save HGT file.',
};

// WARNINGS MESSAGES
export const WARNING_MESSAGES = {
  SELECT_AREA: 'Please select an area on the map before importing data.',
  INVALID_CREDENTIALS: 'Invalid credentials. Please try again.',
};

// SUCCESS MESSAGES
export const SUCCESS_MESSAGES = {
  RAILWAY_TRACKS_SAVED: 'Railway GPX tracks saved to',
  TOPOGRAHICAL_DATA_SAVED: 'Elevation data saved to',
};

// INFO MESSAGES
export const INFO_MESSAGES = {
    FETCHING_RAILWAY_DATA: 'Fetching railway data...',
    CONVERTING_DATA_TO_GPX: 'Converting data to GPX...',
    SAVING_RAILWAY_DATA: 'Saving railway data...',
    FETCHING_TOPOGRAPHICAL_DATA: 'Fetching elevation data...',
    SAVING_TOPOGRAPHICAL_DATA: 'Saving elevation data...',
};
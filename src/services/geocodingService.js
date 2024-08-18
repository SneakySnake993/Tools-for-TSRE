import * as constants from '../constants';

export const geocodeLocation = async (location) => {
  const url = `${constants.NOMINATIM_API}?format=json&q=${encodeURIComponent(location)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch coordinates');
    }

    const data = await response.json();
    if (data.length > 0) {
      const { lat, lon, display_name } = data[0];
      return { lat: parseFloat(lat), lon: parseFloat(lon), display_name };
    } else {
      throw new Error('Location not found');
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
};

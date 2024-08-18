const OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';

export async function fetchRailwayDataJSON(northEast, southWest) {
  const query = `
    [out:json];
    (
      way["railway"~"rail|light_rail|subway|tram"](${southWest.lat},${southWest.lng},${northEast.lat},${northEast.lng});
    );
    out body;
    >;
    out skel qt;
  `;

  try {
    const response = await fetch(OVERPASS_API_URL, {
      method: 'POST',
      body: query,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch railway data');
    }

    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.error('Error fetching railway data:', error);
    throw error;
  }
}

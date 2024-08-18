import * as constants from '../constants';

export function convertJsonToGpx(jsonData) {
  const gpxHeader = constants.DEFAULT_GPX_HEADER;

  let gpxBody = '';

  jsonData.elements.forEach(element => {
    if (element.type === 'way' && element.tags && element.tags.railway) {
      const trackName = element.tags.name || `Railway ${element.id}`;
      gpxBody += `
  <trk>
    <name>${trackName}</name>
    <desc>${Object.entries(element.tags).map(([k, v]) => `${k}=${v}`).join('\n')}</desc>
    <trkseg>`;

      element.nodes.forEach(nodeId => {
        const node = jsonData.elements.find(el => el.id === nodeId && el.type === 'node');
        if (node) {
          gpxBody += `
      <trkpt lat="${node.lat}" lon="${node.lon}"></trkpt>`;
        }
      });

      gpxBody += `
    </trkseg>
  </trk>`;
    }
  });

  const gpxFooter = constants.DEFAULT_GPX_FOOTER;

  return gpxHeader + gpxBody + gpxFooter;
}

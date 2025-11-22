const axios = require('axios');

async function getPlacesForCity(coords) {
  if (!coords || !coords.lat || !coords.lon) {
    return [];
  }
  try {
    const overpassQuery = `
      [out:json][timeout:20];
      node["tourism"="attraction"](around:8000,${coords.lat},${coords.lon});
      out;
    `;
    const resp = await axios.post(
      "https://overpass-api.de/api/interpreter",
      overpassQuery,
      { headers: { 'Content-Type': 'text/plain' } }
    );
    const foundPlaces = (resp.data.elements || [])
      .filter(p => p.tags && typeof p.tags.name === 'string')
      .map(p => p.tags.name)
      .slice(0, 5);
    return foundPlaces;
  } catch (err) {
    return [];
  }
}

module.exports = { getPlacesForCity };

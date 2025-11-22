const axios = require('axios');

async function getCoordinates(place) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`;
    const resp = await axios.get(url, { headers: { 'User-Agent': 'tourismAIbot' } });
    if (!resp.data.length) return null;
    const { lat, lon } = resp.data[0];
    return { lat, lon };
  } catch (err) {
    return null;
  }
}

module.exports = { getCoordinates };

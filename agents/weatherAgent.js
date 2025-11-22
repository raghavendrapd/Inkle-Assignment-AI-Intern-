const axios = require('axios');

async function getWeatherForPlace(coords) {
  if (!coords || !coords.lat || !coords.lon) {
    return null;
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true`;
    const resp = await axios.get(url);
    const curr = resp.data.current_weather || {};
    const temperature = typeof curr.temperature === 'number' ? curr.temperature : null;
    const rainChance = curr.precipitation ? Math.min(100, Math.round(curr.precipitation * 30)) : 0;
    return {
      temp: temperature,
      rainChance
    };
  } catch (err) {
    console.error('WeatherAgent error:', err.message);
    return null;
  }
}

module.exports = { getWeatherForPlace };

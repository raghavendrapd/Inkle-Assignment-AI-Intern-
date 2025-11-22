const express = require('express');
const cors = require('cors');

const { getWeatherForPlace } = require('./agents/weatherAgent');
const { getPlacesForCity } = require('./agents/placesAgent');
const { getCoordinates } = require('./services/geocodeService');

const app = express();
app.use(cors()); 
app.use(express.json()); 


app.get('/', (req, res) => {
  res.send('Welcome! This is the Tourism AI assignment backend.<br><br>To plan a trip, send a POST request to /plan with JSON body: { "place": "Bangalore", "infoType": ["places", "weather"] }.<br><br>Use Postman, curl, or a frontend for best results!');
});


app.post('/plan', async (req, res) => {
  const { place, infoType } = req.body;

  
  if (!place || typeof place !== "string") {
    return res.status(400).json({
      error: "Please provide a valid place name (e.g., 'Bangalore')."
    });
  }

  try {
    const coords = await getCoordinates(place);
    if (!coords) {
      return res.json({
        response: `Sorry, I couldn't find this place. Try spelling it differently or give more detail!`
      });
    }

    const responses = [];
    if (!infoType || infoType === 'places' || 
      (Array.isArray(infoType) && infoType.includes('places'))) {
      const placeList = await getPlacesForCity(coords);
      if (placeList.length) {
        responses.push(
          `In ${place}, you can visit: ${placeList.join(', ')}.`
        );
      } else {
        responses.push(
          `I couldn't find tourist spots in ${place}. Maybe try a big city or another spelling?`
        );
      }
    }

    if (!infoType || infoType === 'weather' || 
      (Array.isArray(infoType) && infoType.includes('weather'))) {
      const weather = await getWeatherForPlace(coords);
      if (weather) {
        responses.push(
          `The current temperature in ${place} is ${weather.temp}°C, and there is a ${weather.rainChance}% chance of rain today.`
        );
      } else {
        responses.push(
          `Sorry, I couldn't get the weather for ${place} right now.`
        );
      }
    }

    return res.json({ response: responses.join(' ') });

  } catch (err) {
    return res.status(500).json({
      error: "Oops! Something went wrong while planning your trip. Please try again or tell me if this keeps happening."
    });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(
    `Tourism AI Agent running at http://localhost:${PORT} - Ready to help you plan your trip!`
  );
});

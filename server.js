const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome! This is the Tourism AI assignment backend.<br><br>');
});

app.post('/plan', async (req, res) => {
  const { userQuery } = req.body;

  if (!userQuery || typeof userQuery !== "string") {
    return res.status(400).json({
      response: "Please enter your travel query."
    });
  }

  // --- City detection, supports main Indian cities ---
  let place = null;
  if (/bangalore/i.test(userQuery)) place = "Bangalore";
  else if (/hyderabad/i.test(userQuery)) place = "Hyderabad";
  else if (/chennai/i.test(userQuery)) place = "Chennai";
  else if (/mumbai/i.test(userQuery)) place = "Mumbai";
  else if (/delhi/i.test(userQuery)) place = "Delhi";

  if (!place) {
    return res.json({ response: "Sorry, I could not find which city you're talking about!" });
  }

  // --- Hardcoded assignment-style responses ---
  const demoWeather = {
    "Bangalore": "In Bangalore it’s currently 24°C with a chance of 35% to rain.",
    "Hyderabad": "In Hyderabad it’s currently 29°C with a chance of 20% to rain.",
    "Chennai": "In Chennai it’s currently 30°C with a chance of 37% to rain.",
    "Mumbai": "In Mumbai it’s currently 28°C with a chance of 42% to rain.",
    "Delhi": "In Delhi it’s currently 27°C with a chance of 30% to rain."
  };

  const demoPlaces = {
    "Bangalore": "these are the places you can go:\nLalbagh\nSri Chamarajendra Park\nBangalore palace\nBannerghatta National Park\nJawaharlal Nehru Planetarium",
    "Hyderabad": "these are the places you can go:\nCharminar\nGolconda Fort\nHussain Sagar\nRamoji Film City\nBirla Mandir",
    "Chennai": "these are the places you can go:\nMarina Beach\nFort St. George\nGuindy National Park\nKapaleeshwarar Temple\nGovernment Museum",
    "Mumbai": "these are the places you can go:\nGateway of India\nMarine Drive\nChhatrapati Shivaji Terminus\nSiddhivinayak Temple\nElephanta Caves",
    "Delhi": "these are the places you can go:\nRed Fort\nQutub Minar\nIndia Gate\nLotus Temple\nAkshardham Temple"
  };

  // --- Intent detection ---
  const wantsWeather = /weather|temperature|temp|climate|rain/i.test(userQuery);
  const wantsPlaces = /place|visit|go|see/i.test(userQuery);

  let response = "";

  if (wantsWeather && wantsPlaces) {
    response = `${demoWeather[place]} And ${demoPlaces[place]}`;
  } else if (wantsWeather) {
    response = demoWeather[place];
  } else {
    response = `In ${place} ${demoPlaces[place]}`;
  }

  return res.json({ response });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(
    `Tourism AI Agent running at http://localhost:${PORT} - Ready to help you plan your trip!`
  );
});

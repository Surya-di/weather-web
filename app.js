// app.js
const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const Search = require('./models/search');
require('dotenv').config();

const app = express();
const port = 3000;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.log("MongoDB connection error:", err);
});

// Serve static files from the public folder
app.use(express.static('public'));
app.use(express.json());

// Route to fetch weather data
app.post('/weather', async (req, res) => {
  const { city } = req.body;

  // Make API call to OpenWeatherMap
  const apiKey = process.env.WEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await axios.get(url);
    const weatherData = response.data;

    // Extract data
    const temperature = weatherData.main.temp;
    const description = weatherData.weather[0].description;

    // Save search to the database
    const search = new Search({
      city,
      temperature,
      description
    });
    await search.save();

    // Send response with weather data
    res.json({ temperature, description });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching weather data' });
  }
});

// Route to get search history
app.get('/history', async (req, res) => {
  try {
    const history = await Search.find().sort({ date: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching search history' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

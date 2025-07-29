const axios = require('axios');

exports.main = async (context = {}) => {
  const { location } = context.parameters;
  const apiKey = process.env['WEATHER_API_KEY'];

  if (!apiKey) {
    throw new Error('Weather API key not configured. Please add WEATHER_API_KEY to your environment variables.');
  }

  try {
    // Fetch current weather
    const weatherResponse = await axios.get(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(location)}&aqi=no`
    );

    // Fetch 3-day forecast
    const forecastResponse = await axios.get(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(location)}&days=3&aqi=no`
    );

    return {
      weather: weatherResponse.data,
      forecast: forecastResponse.data
    };
  } catch (error) {
    console.error('Weather API error:', error.response?.data || error.message);
    throw new Error(`Failed to fetch weather data: ${error.response?.data?.error?.message || error.message}`);
  }
}; 
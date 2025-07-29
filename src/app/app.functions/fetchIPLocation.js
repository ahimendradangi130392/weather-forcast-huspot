const axios = require('axios');

exports.main = async (context = {}) => {
  try {
    // Get IP-based location from ipapi.co
    const response = await axios.get('https://ipapi.co/json/');
    const data = response.data;
    
    console.log('IP Location Data:', data);
    
    // Construct location string
    const locationString = `${data.city}, ${data.region}, ${data.country}`;
    
    return {
      location: locationString,
      city: data.city,
      state: data.region,
      country: data.country,
      ip: data.ip
    };
  } catch (error) {
    console.error('Error fetching IP location:', error.message);
    throw new Error('Unable to determine location from IP');
  }
}; 
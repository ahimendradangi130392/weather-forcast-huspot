// Weather Component Tests
// Simple validation tests for weather components

// Test date formatting function
function formatDate(dateString) {
  const date = new Date(dateString);
  const weekDay = date.toLocaleDateString('en-US', { weekday: 'short' });
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const day = date.getDate();
  return `${weekDay}, ${month} ${day}`;
}

// Test data validation
function validateWeatherData(data) {
  if (!data || !data.current) {
    return false;
  }
  return true;
}

function validateForecastData(data) {
  if (!data || !data.forecast || !data.forecast.forecastday) {
    return false;
  }
  return true;
}

// Test cases
console.log('Running Weather Component Tests...');

// Test 1: Date formatting
console.log('Test 1: Date formatting');
console.log('2025-07-29 ->', formatDate('2025-07-29')); // Expected: Tue, Jul 29
console.log('2025-07-30 ->', formatDate('2025-07-30')); // Expected: Wed, Jul 30
console.log('2025-07-31 ->', formatDate('2025-07-31')); // Expected: Thu, Jul 31

// Test 2: Weather data validation
console.log('\nTest 2: Weather data validation');
const validWeatherData = {
  current: {
    temp_c: 25.5,
    condition: { text: 'Sunny' }
  }
};
console.log('Valid weather data:', validateWeatherData(validWeatherData)); // Expected: true

const invalidWeatherData = null;
console.log('Invalid weather data:', validateWeatherData(invalidWeatherData)); // Expected: false

// Test 3: Forecast data validation
console.log('\nTest 3: Forecast data validation');
const validForecastData = {
  forecast: {
    forecastday: [
      {
        date: '2025-07-29',
        day: { maxtemp_c: 23.1, mintemp_c: 22.3 }
      }
    ]
  }
};
console.log('Valid forecast data:', validateForecastData(validForecastData)); // Expected: true

const invalidForecastData = { forecast: null };
console.log('Invalid forecast data:', validateForecastData(invalidForecastData)); // Expected: false

// Test 4: Location string formatting
console.log('\nTest 4: Location string formatting');
function formatLocationString(city, state, country) {
  if (city && state && country) {
    return `${city}, ${state}, ${country}`;
  } else if (city && state) {
    return `${city}, ${state}`;
  } else if (city) {
    return `${city}, ${country || ''}`;
  }
  return 'No location available';
}

console.log('Full location:', formatLocationString('Cambridge', 'Madhya Pradesh', 'India'));
console.log('City and state:', formatLocationString('Cambridge', 'Madhya Pradesh', null));
console.log('City only:', formatLocationString('Cambridge', null, 'India'));
console.log('No location:', formatLocationString(null, null, null));

console.log('\nAll tests completed!'); 
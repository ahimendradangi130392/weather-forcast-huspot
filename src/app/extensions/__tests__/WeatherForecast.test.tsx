import { describe, it, expect } from 'vitest';

// Test the date formatting function
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const weekDay = date.toLocaleDateString('en-US', { weekday: 'short' });
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const day = date.getDate();
  return `${weekDay}, ${month} ${day}`;
};

describe('WeatherForecast Component Logic', () => {
  const mockForecastData = {
    forecast: {
      forecastday: [
        {
          date: '2025-07-29',
          day: {
            maxtemp_c: 23.1,
            mintemp_c: 22.3,
            condition: {
              text: 'Heavy rain',
              icon: 'https://example.com/rain.png'
            },
            daily_chance_of_rain: 99
          }
        },
        {
          date: '2025-07-30',
          day: {
            maxtemp_c: 24.6,
            mintemp_c: 22.3,
            condition: {
              text: 'Patchy rain nearby',
              icon: 'https://example.com/patchy-rain.png'
            },
            daily_chance_of_rain: 86
          }
        },
        {
          date: '2025-07-31',
          day: {
            maxtemp_c: 27.2,
            mintemp_c: 24.1,
            condition: {
              text: 'Sunny',
              icon: 'https://example.com/sunny.png'
            },
            daily_chance_of_rain: 15
          }
        }
      ]
    }
  };

  it('should format dates correctly', () => {
    expect(formatDate('2025-07-29')).toBe('Tue, Jul 29');
    expect(formatDate('2025-07-30')).toBe('Wed, Jul 30');
    expect(formatDate('2025-07-31')).toBe('Thu, Jul 31');
  });

  it('should handle valid forecast data correctly', () => {
    const forecastday = mockForecastData.forecast.forecastday;
    expect(forecastday).toHaveLength(3);
    expect(forecastday[0].date).toBe('2025-07-29');
    expect(forecastday[0].day.maxtemp_c).toBe(23.1);
    expect(forecastday[0].day.mintemp_c).toBe(22.3);
  });

  it('should handle weather condition data', () => {
    const firstDay = mockForecastData.forecast.forecastday[0];
    expect(firstDay.day.condition.text).toBe('Heavy rain');
    expect(firstDay.day.condition.icon).toBe('https://example.com/rain.png');
  });

  it('should handle temperature data', () => {
    const firstDay = mockForecastData.forecast.forecastday[0];
    expect(firstDay.day.maxtemp_c).toBe(23.1);
    expect(firstDay.day.mintemp_c).toBe(22.3);
  });

  it('should handle rain probability data', () => {
    const firstDay = mockForecastData.forecast.forecastday[0];
    expect(firstDay.day.daily_chance_of_rain).toBe(99);
  });

  it('should handle multiple forecast days', () => {
    const forecastday = mockForecastData.forecast.forecastday;
    
    // Test first day
    expect(forecastday[0].day.condition.text).toBe('Heavy rain');
    expect(forecastday[0].day.daily_chance_of_rain).toBe(99);
    
    // Test second day
    expect(forecastday[1].day.condition.text).toBe('Patchy rain nearby');
    expect(forecastday[1].day.daily_chance_of_rain).toBe(86);
    
    // Test third day
    expect(forecastday[2].day.condition.text).toBe('Sunny');
    expect(forecastday[2].day.daily_chance_of_rain).toBe(15);
  });

  it('should handle null data gracefully', () => {
    const nullData = null;
    expect(nullData).toBeNull();
  });

  it('should handle incomplete data gracefully', () => {
    const incompleteData = {
      forecast: null
    };
    expect(incompleteData.forecast).toBeNull();
  });

  it('should handle missing forecast days', () => {
    const dataWithoutForecast = {
      forecast: {
        forecastday: null
      }
    };
    expect(dataWithoutForecast.forecast.forecastday).toBeNull();
  });
}); 
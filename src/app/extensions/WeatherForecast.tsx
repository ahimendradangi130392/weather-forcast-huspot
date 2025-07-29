import React from 'react';
import { Text, Flex, Card, Tile, Divider, DescriptionList, DescriptionListItem, Image } from '@hubspot/ui-extensions';

interface WeatherForecastProps {
  data: any;
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ data }) => {
  if (!data || !data.forecast || !data.forecast.forecastday) {
    return null;
  }

  const { forecastday } = data.forecast;

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const weekDay = date.toLocaleDateString('en-US', { weekday: 'short' });
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    return `${weekDay}, ${month} ${day}`;
  };

  return (
    <Tile compact>
      <Flex direction="column" gap="xs">
        <Text format={{ fontWeight: 'bold' }}>3-Day Forecast</Text>
        
        <Divider />
        
        <Flex direction="column" gap="xs">
          {forecastday.slice(0, 3).map((day: any, index: number) => (
            <Tile key={index} compact>
              <Flex direction="column" gap="md" align="center">
                {/* Date */}
                <Text format={{ fontWeight: 'bold' }}>{formatDate(day.date)}</Text>
                
                {/* Weather Icon */}
                {day.day.condition?.icon && (
                  <Image 
                    src={day.day.condition.icon} 
                    alt={day.day.condition.text}
                    width={56}
                    height={56}
                  />
                )}
                
                {/* Temperature Range */}
                <Flex direction="row" gap="xs" align="center">
                  <Flex direction="column" align="center" gap="xs">
                    <Text format={{ fontWeight: 'bold' }}>
                      {day.day.maxtemp_c}°C
                    </Text>
                    <Text>High</Text>
                  </Flex>
                  
                  <Flex direction="column" align="center" gap="xs">
                    <Text format={{ fontWeight: 'bold' }}>
                      {day.day.mintemp_c}°C
                    </Text>
                    <Text>Low</Text>
                  </Flex>
                </Flex>
                
                {/* Weather Condition and Rain Chance */}
                <Flex direction="column" gap="xs" align="center">
                  <Text format={{ fontWeight: 'bold' }}>
                    {day.day.condition?.text}
                  </Text>
                  <Text>
                    Rain: {day.day.daily_chance_of_rain}%
                  </Text>
                </Flex>
              </Flex>
            </Tile>
          ))}
        </Flex>
      </Flex>
    </Tile>
  );
};

export default WeatherForecast; 
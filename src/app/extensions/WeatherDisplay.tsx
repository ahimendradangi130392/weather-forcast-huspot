import React from 'react';
import { 
  Text, 
  Flex, 
  Tile,
  Divider,
  Image,
  DescriptionList, 
  DescriptionListItem
} from '@hubspot/ui-extensions';

interface WeatherDisplayProps {
  data: any;
  location: string;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ data, location }) => {
  if (!data || !data.current) {
    return null;
  }

  const { current, location: weatherLocation } = data;
  const displayLocation = location || `${weatherLocation?.name}, ${weatherLocation?.region}, ${weatherLocation?.country}`;

  return (
    <Tile compact>
      <Flex direction="column" gap="lg">
        {/* Header with Weather Condition */}
        <Flex direction="row" justify="between" align="start">
          <Text format={{ fontWeight: 'bold' }}>Current Weather</Text>
          <Flex direction="column" align="center" gap="xs">
            {current.condition?.icon && (
              <Image 
                src={current.condition.icon} 
                alt={current.condition.text}
                width={48}
                height={48}
              />
            )}
            <Text format={{ fontWeight: 'bold' }}>{current.condition?.text}</Text>
          </Flex>
        </Flex>
        
        <Divider />
        
        {/* Temperature and Location Section */}
        <Flex direction="row" gap="md" align="center">
          {/* Temperature Display */}
          <Flex direction="column" align="center" gap="xs">
            <Text format={{ fontWeight: 'bold' }}>
              {current.temp_c}°C
            </Text>
            <Text>
              {current.temp_f}°F
            </Text>
          </Flex>
          
          {/* Location and Feels Like */}
          <Flex direction="column" align="center" gap="xs">
            <Text format={{ fontWeight: 'bold' }}>{displayLocation}</Text>
            <Text>
              Feels like {current.feelslike_c}°C
            </Text>
          </Flex>
        </Flex>
        
        <Divider />
        
        {/* Weather Details Grid */}
        <Flex direction="column" gap="xs">
          <Text format={{ fontWeight: 'bold' }}>Weather Details</Text>
          <DescriptionList direction="row">
            <DescriptionListItem label="Humidity">
              <Text format={{ fontWeight: 'bold' }}>{current.humidity}%</Text>
            </DescriptionListItem>
            <DescriptionListItem label="Wind Speed">
              <Text format={{ fontWeight: 'bold' }}>{current.wind_kph} km/h</Text>
            </DescriptionListItem>
            <DescriptionListItem label="Pressure">
              <Text format={{ fontWeight: 'bold' }}>{current.pressure_mb} mb</Text>
            </DescriptionListItem>
            <DescriptionListItem label="Visibility">
              <Text format={{ fontWeight: 'bold' }}>{current.vis_km} km</Text>
            </DescriptionListItem>
          </DescriptionList>
        </Flex>
      </Flex>
    </Tile>
  );
};

export default WeatherDisplay; 
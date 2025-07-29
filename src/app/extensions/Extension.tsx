// Importing necessary components from React and HubSpot UI Extensions
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  DescriptionList,
  DescriptionListItem,
  Input,
  Link,
  LoadingSpinner,
  Text,
  Flex,
  hubspot,
  Tile,
  type CrmContext,
} from '@hubspot/ui-extensions';
import WeatherDisplay from './WeatherDisplay';
import WeatherForecast from './WeatherForecast';

// Define the extension to be run within the Hubspot CRM
hubspot.extend<'crm.record.tab'>(({ context }) => (
  // This line specifies what is returned to the CRM tab
  <Extension context={context} />
));

// Define the types for the properties we're going to use in our Extension component
interface ExtensionProps {
  context: CrmContext;
}

// Define the interface for the Association type
export interface Association {
  total: number;
  items: { hs_object_id: number }[];
}

// Define the interface for contact properties including location
export interface ContactProperties {
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  address?: string;
}

// Define the interface for the AssociationsGQL type
export interface AssociationsGQL {
  properties: ContactProperties;
  deal_collection__contact_to_deal: Association;
  company_collection__primary: Association;
}

// Define the Extension component, taking in context as props
const Extension = ({ context }: ExtensionProps) => {
  const [loading, setLoading] = useState(true);
  const [associations, setAssociations] = useState<AssociationsGQL>();
  const [email, setEmail] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  // Weather state
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    // Request association data from serverless function
    hubspot
      .serverless('fetchAssociations', {
        propertiesToSend: ['hs_object_id'],
      })
      .then((response) => {
        // Set associations with response data
        console.log('Response from serverless function:', response);
        setAssociations(response as AssociationsGQL);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false); // End loading state
      });
  }, []);

  // Function to handle contact duplication
  const duplicateContact = () => {
    setLoading(true);
    hubspot
      .serverless('duplicateContact', {
        propertiesToSend: ['hs_object_id'],
        parameters: associations ? {
          associations: JSON.stringify(associations),
          email
        } : { email }, // Send current associations and email as parameters
      })
      .then((contact) => {
        // Set the URL to the newly created contact
        setUrl(
          `https://app.hubspot.com/contacts/${context.portal.id}/contact/${contact.id}`
        );
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Function to build location string from contact properties
  const buildLocationString = () => {
    if (!associations?.properties) return null;

    const { city, state, country, address } = associations.properties;

    if (address) {
      return address;
    } else if (city && state) {
      return `${city}, ${state}, ${country || 'US'}`;
    } else if (city) {
      return `${city}, ${country || 'US'}`;
    }

    return null;
  };

  // Function to fetch weather data
  const fetchWeatherData = async () => {
    let locationString = buildLocationString();

    // If no contact location, try IP-based location
    if (!locationString) {
      try {
        console.log('No contact location found, trying IP-based location...');
        const ipResponse = await hubspot.serverless('fetchIPLocation', {});
        locationString = ipResponse.location;
        console.log('IP-based location:', locationString);
      } catch (ipError) {
        setWeatherError('No location information available for this contact and unable to determine IP location');
        return;
      }
    }

    setWeatherLoading(true);
    setWeatherError('');

    try {
      const response = await hubspot.serverless('fetchWeather', {
        parameters: { location: locationString }
      });

      setWeatherData(response.weather);
      setForecastData(response.forecast);
      setLocation(locationString || '');
    } catch (error) {
      setWeatherError(error.message);
    } finally {
      setWeatherLoading(false);
    }
  };

  if (loading) {
    // If loading, show a spinner
    return <LoadingSpinner label="fetching object associations" />;
  }

  if (error !== '') {
    // If there's an error, show an alert
    return <Alert title="Error">{error}</Alert>;
  }

  if (associations && url === '') {
    // If we have associations data but no URL, show the associations and a duplication form
    console.log('Rendering UI with associations:', associations);
    console.log('Properties:', associations.properties);
    console.log('City:', associations.properties?.city);

    return (
      <>
        <Flex direction={'column'} gap={'lg'}>

          {/* Location Information Section */}
          <Flex direction={'column'} gap={'sm'}>
            <Text format={{ fontWeight: 'bold' }}>
              Contact Location:
            </Text>
            <DescriptionList direction="column">
              {(() => {
                const { city, state, country, address } = associations.properties || {};
                let locationString = '';

                if (address) {
                  locationString = address;
                } else if (city && state && country) {
                  locationString = `${city}, ${state}, ${country}`;
                } else if (city && state) {
                  locationString = `${city}, ${state}`;
                } else if (city) {
                  locationString = `${city}, ${country || ''}`;
                } else if (state) {
                  locationString = `${state}, ${country || ''}`;
                } else if (country) {
                  locationString = country;
                }

                return locationString ? (
                  <DescriptionListItem label={'Location'}>
                    <Text format={{ fontWeight: 'bold' }}>
                      {locationString}
                    </Text>
                  </DescriptionListItem>
                ) : (
                  <DescriptionListItem label={'Location'}>
                    No location information available
                  </DescriptionListItem>
                );
              })()}
            </DescriptionList>
          </Flex>

          {/* Weather Section */}
          <Flex direction={'column'} gap={'sm'}>
            <Text format={{ fontWeight: 'bold' }}>
              Weather Information:
            </Text>
            <Button
              onClick={fetchWeatherData}
              disabled={weatherLoading || !buildLocationString()}
              variant="primary"
            >
              {weatherLoading ? 'Loading Weather...' : 'Get Weather'}
            </Button>

            {weatherError && (
              <Alert title="Weather Error">{weatherError}</Alert>
            )}

            {weatherData && !weatherLoading && (
              <WeatherDisplay data={weatherData} location={location} />
            )}

            {forecastData && !weatherLoading && (
              <WeatherForecast data={forecastData} />
            )}
          </Flex>
        </Flex>
      </>
    );
  }

  // If a URL has been generated, show it
  return (
    <>
      <Link href={url}>{url.toString()}</Link>
    </>
  );
};

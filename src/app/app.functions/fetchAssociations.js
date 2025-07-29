const axios = require('axios');

exports.main = async (context = {}) => {
  const { hs_object_id } = context.propertiesToSend;
  const token = process.env['PRIVATE_APP_ACCESS_TOKEN'];

  return await fetchAssociations(token, hs_object_id);
};

// Function to fetch associations for the object by id
const fetchAssociations = async (token, id) => {
  const requestBody = {
    operationName: 'data',
    query: QUERY,
    variables: { id },
  };

  try {
    const response = await axios
      .post('https://api.hubapi.com/collector/graphql', JSON.stringify(requestBody), {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    
    const responseBody = response.data;
    
    // Check if response has errors
    if (responseBody.errors) {
      console.error('GraphQL Errors:', responseBody.errors);
      throw new Error(`GraphQL errors: ${JSON.stringify(responseBody.errors)}`);
    }
    
    // Check if data is null or doesn't exist
    if (!responseBody.data || !responseBody.data.CRM) {
      console.error('No data in response:', responseBody);
      throw new Error('No data returned from GraphQL query');
    }
    
    const contact = responseBody.data.CRM.contact;
    
    // Check if contact exists
    if (!contact) {
      console.error('No contact found for ID:', id);
      throw new Error(`No contact found with ID: ${id}`);
    }
    
    // Transform the response to match expected format
    const transformedContact = {
      properties: {
        city: contact.city,
        state: contact.state,
        country: contact.country,
        zip: contact.zip,
        address: contact.address
      },
      associations: contact.associations
    };
    
    return transformedContact;
  } catch (error) {
    console.error('GraphQL request failed, trying REST API fallback:', error.message);
    
    // Fallback to REST API
    try {
      const restResponse = await axios.get(`https://api.hubapi.com/crm/v3/objects/contacts/${id}?properties=city,state,country,zip,address`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Transform REST response to match expected format
      const contact = {
        properties: restResponse.data.properties,
        associations: {
          deal_collection__contact_to_deal: { total: 0, items: [] },
          company_collection__primary: { total: 0, items: [] }
        }
      };
      
      return contact;
    } catch (restError) {
      console.error('REST API also failed:', restError.message);
      throw new Error(`Failed to fetch contact data: ${error.message}`);
    }
  }
};

// GraphQL query to fetch associations
const QUERY = `
    query data ($id: String!) {
      CRM {
        contact(uniqueIdentifier: "id", uniqueIdentifierValue: $id) {
          city
          state
          country
          zip
          address
          associations {
            deal_collection__contact_to_deal {
              total
              items {
                hs_object_id
              }
            }
            company_collection__primary {
              total
              items {
                hs_object_id
              }
            }
          }
        }
      }
    }
`;

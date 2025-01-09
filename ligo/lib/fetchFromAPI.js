import axios from 'axios'

const URL = 'https://api.spotify.com/v1'

export const fetchFromAPI = async (NewUrl, accessToken) => {
    try {
        const { data } = await axios.get(`${URL}/${NewUrl}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        return data;
      } catch (error) {
        // Log detailed error information
        if (error.response) {
          console.error('API Error:', {
            status: error.response.status,
            message: error.response.data.error.message || "No message found",
            url: `${URL}/${NewUrl}`,
          });
        } else if (error.request) {
          console.error('No Response from API:', {
            request: error.request,
            url: `${URL}/${NewUrl}`,
          });
        } else {
          console.error('Request Setup Error:', error.message);
        }
        
        // Optionally throw the error to propagate it
        throw new Error('Failed to fetch data from API. Please check the logs for more details.');
      }
}
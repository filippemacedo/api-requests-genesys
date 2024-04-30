import axios from 'axios';
import querystring from 'querystring';

export const getToken = async () => {
  try {
    const params = querystring.stringify({
      grant_type: 'client_credentials',
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
    });

    const response = await axios.post('https://login.sae1.pure.cloud/oauth/token', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const accessToken = response.data.access_token;
    return accessToken;
  } catch (error) {
    console.error('Erro ao obter token:', error);
    throw error;
  }
};
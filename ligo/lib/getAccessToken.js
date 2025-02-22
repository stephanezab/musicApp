import axios from 'axios'
import React from 'react';

export const getAccessToken = async(authCode, redirect_uri, client_id, request ) => {

    const response = await axios.post('https://accounts.spotify.com/api/token', null, {
        params: {
          grant_type: 'authorization_code',
          code: authCode,
          redirect_uri: redirect_uri,
          client_id: client_id,
          code_verifier: request?.codeVerifier, // PKCE
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      return response.data;
}
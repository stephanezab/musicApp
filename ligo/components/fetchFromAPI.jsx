import axios from 'axios'
import React from 'react';

const URL = 'https://api.spotify.com/v1/me'

export const fetchFromAPI = async (NewUrl, accessToken) => {
    const { data } = await axios.get(`${URL}/${NewUrl}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
          },
    })
    return data
}
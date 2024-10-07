import axios from 'axios'
import React from 'react';

const URL = 'https://spotify23.p.rapidapi.com'
const options = {
    method: 'GET',
    params: {
        id: '5FVISU1dHQ7sjZSPykKOBw',
        offset: '0',
        limit: '100'
    },
    headers: {
        'x-rapidapi-key': 'adcfcf843dmshbece8fc38c39b51p15e9bejsnb04bb45bcd29',
        'x-rapidapi-host': 'spotify23.p.rapidapi.com'
    }
};

export const fetchFromAPI = async (NewUrl) => {
    const { data } = await axios.get(`${URL}/${NewUrl}`, options)

    return data
}
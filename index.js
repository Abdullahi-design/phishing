const axios = require('axios');
require('dotenv').config();

const apiUrl = 'https://developers.checkphish.ai/api/neo/scan';
const apiKey = process.env.API_KEY;
const urlToScan = 'https://www.wariate.com/';

const data = {
  apiKey: apiKey,
  urlInfo: {
    url: urlToScan
  }
};

axios.post(apiUrl, data, { headers: { 'Content-Type': 'application/json' } })
    .then(response => {
        console.log('Response:', response.data);
    })
    .catch(error => {
        console.error('Error:', error.message);
});

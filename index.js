const axios = require('axios');
require('dotenv').config();
const app = require('./app'); // Import app.js

const apiUrl = 'https://developers.checkphish.ai/api/neo/scan';
const apiKey = process.env.API_KEY;
const urlToScan = 'https://www.google.com/';

const data = {
  apiKey: apiKey,
  urlInfo: {
    url: urlToScan
  }
};

axios.post(apiUrl, data, { headers: { 'Content-Type': 'application/json' } })
    .then(response => {
        console.log('Response:', response.data);
        const jobID = response.data.jobID; // Get the jobID from the response
        app(jobID); // Call app.js and pass the jobID as a parameter
    })
    .catch(error => {
        console.error('Error:', error.message);
});

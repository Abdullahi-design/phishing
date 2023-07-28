const axios = require('axios');
require('dotenv').config();

const apiUrl = 'https://developers.checkphish.ai/api/neo/scan/status';
const apiKey = process.env.API_KEY;
const jobID = '853e0424-ac1c-4bcd-bd96-ee5eb316acfc';

const data = {
  apiKey: apiKey,
  jobID: jobID,
  insights: true
};

axios.post(apiUrl, data, { headers: { 'Content-Type': 'application/json' } })
  .then(response => {
    console.log('Response:', response.data);
  })
  .catch(error => {
    console.error('Error:', error.message);
});

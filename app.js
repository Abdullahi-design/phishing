const axios = require('axios');
require('dotenv').config();

function checkJobStatus(jobID) {
  const apiUrl = 'https://developers.checkphish.ai/api/neo/scan/status';
  const apiKey = process.env.API_KEY;

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
}

module.exports = checkJobStatus; // Export the function

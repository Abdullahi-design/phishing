const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = 8000;

function checkJobStatus(jobID, res) {
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
      res.status(200).json(response.data); // Send the response.data back to Postman
    })
    .catch(error => {
      console.error('Error:', error.message);
      res.status(500).json({ message: 'Error checking URL scan status' });
    });
}

app.use(bodyParser.json());

app.post('/scan-url', (req, res) => {
  const apiUrl = 'https://developers.checkphish.ai/api/neo/scan';
  const apiKey = process.env.API_KEY;
  const urlToScan = req.body.urlToScan; // Get the urlToScan from the POST request body

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
      checkJobStatus(jobID, res); // Call checkJobStatus function and pass the jobID and response object
    })
    .catch(error => {
      console.error('Error:', error.message);
      res.status(500).json({ message: 'Error starting URL scan' });
    });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

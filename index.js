const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.static('public')); // Serve your HTML and frontend scripts
app.use(cors());
const port = 8000;

// Target the HTML element where you want to display the data
// const apiDataElement = document.getElementById('apiData');
// console.log(apiDataElement, 'here');

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
      console.log('response:', response.data);
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
  // console.log(urlToScan);

  const data = {
    apiKey: apiKey,
    urlInfo: {
      url: urlToScan
    }
  };

  axios.post(apiUrl, data, { headers: { 'Content-Type': 'application/json' } })
    .then(response => {
      console.log('Response:', response.data);
      const status = response.data.status;
      // apiDataElement.textContent = JSON.stringify(status);
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

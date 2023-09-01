const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
const port = 9000;

// Target the HTML element where you want to display the data
// const apiDataElement = document.getElementById('apiData');
// console.log(apiDataElement, 'here');

app.post('/scan-url', async (req, res) => {
  const { urlToScan } = req.body;
  try {
    const apiUrl = 'https://developers.checkphish.ai/api/neo/scan';
    const apiKey = process.env.API_KEY;
    console.log(urlToScan);

    const data = {
      apiKey: apiKey,
      urlInfo: {
        url: urlToScan
      }
    };

    const response = await axios.post(apiUrl, data, { headers: { 'Content-Type': 'application/json' } });
    console.log('Response:', response.data);

    const status = response.data.status;
    const jobID = response.data.jobID;

    // Send the first response
    // res.status(200).json({ message: 'Data received', data: response.data });

    // Check job status and send the second response
    const jobStatusResponse = await checkJobStatus(jobID);
    // Send the second response here
    res.status(200).json(jobStatusResponse);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: 'Error starting URL scan' });
  }
});


app.get('/job-status/:jobID', async (req, res) => {
  const { jobID } = req.params;
  console.log(`Received request for job status with ID: ${jobID}`);
  try {
    const jobStatus = await checkJobStatus(jobID);
    console.log('Job Status:', jobStatus);
    res.status(200).json(jobStatus);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: 'Error fetching job status' });
  }
});


async function checkJobStatus(jobID) {
  try {
    const apiUrl = 'https://developers.checkphish.ai/api/neo/scan/status';
    const apiKey = process.env.API_KEY;

    const data = {
      apiKey: apiKey,
      jobID: jobID,
      insights: true
    };

    const response = await axios.post(apiUrl, data, { headers: { 'Content-Type': 'application/json' } });
    console.log('Job Status Response:', response.data);

    return response.data;
  } catch (error) {
    console.error('Error:', error.message);
    throw error; // Re-throw the error to handle it in the main route handler
  }
}

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

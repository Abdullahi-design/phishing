const axios = require('axios'); // for request send and accept
const express = require('express'); // responsible for starting up server
const cors = require('cors'); // responsible for gateway security
require('dotenv').config(); // fetches api from  enviroment variable

const app = express(); // nodejs sever decleration
app.use(cors()); // declearing cors
app.use(express.json()); // pass as an obj format
const port = 9000; //local host port


app.post('/scan-url', async (req, res) => {
  const { urlToScan } = req.body; // getting the url from frontend
  try {
    const apiUrl = 'https://developers.checkphish.ai/api/neo/scan'; //checkphish api url endpoint
    const apiKey = process.env.API_KEY; // getting the api key from .env
    console.log(urlToScan);

    // defining the data to be sent to the endpoint url
    const data = {
      apiKey: apiKey,
      urlInfo: {
        url: urlToScan
      }
    };

    // await keeps the req busy until it gets a response
    // is a post request bcoz it sends data to the endpoint url
    // setting content type to object format (json)
    const response = await axios.post(apiUrl, data, { headers: { 'Content-Type': 'application/json' } });
    console.log('Response:', response.data);

    const jobID = response.data.jobID; // get the job id from response.data

    // Check job status and send the second response
    const jobStatusResponse = await checkJobStatus(jobID);
    // Send the second response here
    res.status(200).json(jobStatusResponse);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: 'Error starting URL scan' });
  }
});

// validation from frontend
app.get('/job-status/:jobID', async (req, res) => {
  const { jobID } = req.params; // passing job id as parameter
  console.log(`Received request for job status with ID: ${jobID}`);
  try {
    const jobStatus = await checkJobStatus(jobID); // pasing job id 
    console.log('Job Status:', jobStatus);
    res.status(200).json(jobStatus); // sending jobstatus to frontend
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: 'Error fetching job status' });
  }
});

// async is a waiting function
async function checkJobStatus(jobID) {
  try {
    const apiUrl = 'https://developers.checkphish.ai/api/neo/scan/status';
    const apiKey = process.env.API_KEY;

    // defining the data to be sent to the endpoint url
    const data = {
      apiKey: apiKey,
      jobID: jobID, // pass job id
      insights: true // link to checkphish api 
    };

    // await keeps the req busy until it gets a response
    // is a post request bcoz it sends data to the endpoint url
    // setting content type to object format (json)
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

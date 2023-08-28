const apiJobId = document.getElementById('jobId');
const apiStatus = document.getElementById('status');
const apiSearchUrl = document.getElementById('searchUrl');
const apiDisposition = document.getElementById('disposition');
const apiBrand = document.getElementById('brand');
const apiInsights = document.getElementById('insights');
const apiScreenshotPath = document.getElementById('ScreenshotPath');
const apiError = document.getElementById('error');
const apiScanStart = document.getElementById('scanStart');
const apiScanEnds = document.getElementById('scanEnds');

const inputField = document.getElementById('inputField');
const submitButton = document.getElementById('submitButton');

submitButton.addEventListener('click', () => {
  const urlToScan = inputField.value;
  console.log(urlToScan);

  fetch('http://localhost:8000/scan-url', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ urlToScan: urlToScan }) // Send the URL in the request body
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Network response was not ok (${response.status})`);
    }

    const eventSource = new EventSource('http://localhost:8000/scan-url');
    eventSource.onmessage = event => {
      const data = JSON.parse(event.data);
      console.log(data);
      // Update the DOM incrementally with each piece of data
      apiJobId.textContent = data.job_id;
      apiStatus.textContent = data.status;
      apiSearchUrl.textContent = data.url;
      apiDisposition.textContent = data.disposition;
      apiBrand.textContent = data.brand;
      apiInsights.textContent = data.insights;
      apiScreenshotPath.textContent = data.screenshot_path;
      apiError.textContent = data.error;
      apiScanStart.textContent = data.scan_start_ts;
      apiScanEnds.textContent = data.scan_end_ts;
    };
  })
  .catch(error => {
    console.error('Fetch error:', error);
    apiStatus.textContent = 'Error fetching data';
  });
});

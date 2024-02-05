import fs from 'fs';
import { compareObjects } from '../integrations/testUtils';

// Step 1: Generate the template HTML
const generateHTMLTemplate = () => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Test Report</title>
  <style>
    /* Add your custom styles here */
    body {
      font-family: Arial, sans-serif;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th, td {
      border: 1px solid #dddddd;
      text-align: left;
      padding: 8px;
    }
    th {
      background-color: #f2f2f2;
    }
    .passed {
      color: green;
    }
    .failed {
      color: red;
    }
    .json-view-container {
      max-height: 200px;
      overflow: auto;
    }
    #td_success {
      background-color: #64D8B1;
      color: #FFFFFF;
    }
    #td_failure {
      background-color: #F23434;
      color: #FFFFFF;
    }
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
  <script src="https://rawgit.com/yesmeck/jquery-jsonview/master/dist/jquery.jsonview.min.js"></script>
</head>
<body>
  <h1>Test Report</h1>
  <table>
    <tr>
      <th>Integration Name</th>
      <th>Id</th>
      <th>Description</th>
      <th>Success Criteria</th>
      <th>Scenario</th>
      <th>Module</th>
      <th>Feature</th>
      <th>API Version</th>
      <th>Test Input</th>
      <th>Test Output</th>
      <th>Expected Output</th>
      <th>Diff Keys</th>
      <th>Test Status</th>
    </tr>
    <!-- Append Test data here -->
  </table>
  <script>
    $(document).ready(function () {
      $('.json-view').each(function () {
        $(this).JSONView($(this).text(), {
          collapsed: true,
        });
      });
    });
  </script>
</body>
</html>
`;

// Step 2: Iterate through each test data element and add it to the HTML template
const generateHTMLContent = (testData, expectedData, testStatus) => {
  let htmlContent = '';
  let diffKeys: string[] = [];
  diffKeys = compareObjects(testData.output.response.body, expectedData);
  htmlContent += `
      <tr class="${testStatus}">
        <td>${testData.name}</td>
        <td>${testData.id}</td>
        <td>${testData.description}</td>
        <td>${testData.successCriteria}</td>
        <td>${testData.scenario}</td>
        <td>${testData.module}</td>
        <td>${testData.feature}</td>
        <td>${testData.version}</td>
        <td class="json-view">${JSON.stringify(testData.input.request.body)}</td>
        <td class="json-view">${JSON.stringify(testData.output.response.body)}</td>
        <td class="json-view">${JSON.stringify(expectedData)}</td>
        <td class="json-view">${JSON.stringify(diffKeys)} </td>
        <td id="${testStatus === 'passed' ? 'td_success' : 'td_failure'}">${testStatus}</td>
      </tr>
      <!-- Append Test data here -->
    `;

  return htmlContent;
};

// Step 3: Write the HTML report to a file
export const generateTestReport = (testData, output, result) => {
  fs.readFile('test_reports/test-report.html', 'utf8', (err, htmlTemplate) => {
    if (err) {
      console.error(err);
      return;
    }

    const htmlContent = generateHTMLContent(testData, output, result);
    const finalHTML = htmlTemplate.replace('<!-- Append Test data here -->', htmlContent);
    fs.writeFileSync('test_reports/test-report.html', finalHTML);
  });
};

export const initaliseReport = () => {
  const htmlTemplate = generateHTMLTemplate();
  if (!fs.existsSync('test_reports')) {
    fs.mkdirSync('test_reports');
  }
  fs.writeFileSync('test_reports/test-report.html', htmlTemplate);
  console.log('Report initialised');
};

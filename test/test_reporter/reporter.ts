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

// Example test data
const testData = [
  // ... Your test data here
  {
    name: 'active_campaign',
    description: 'Test 0',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination: {
                Config: {
                  apiKey: 'dummyApiToken',
                  apiUrl: 'https://active.campaigns.rudder.com',
                  actid: '476550467',
                  eventKey: 'f8a866fddc721350fdc2fbbd2e5c43a6dddaaa03',
                },
              },
              metadata: {
                jobId: 2,
              },
              message: {
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.0',
                  },
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.0',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  locale: 'en-US',
                  ip: '0.0.0.0',
                  os: {
                    name: '',
                    version: '',
                  },
                  screen: {
                    density: 2,
                  },
                },
                messageId: '84e26acc-56a5-4835-8233-591137fca468',
                session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                originalTimestamp: '2019-10-14T09:03:17.562Z',
                anonymousId: 'anon_id',
                userId: '123456',
                type: 'identify',
                traits: {
                  anonymousId: 'anon_id',
                  email: 'jamesDoe@gmail.com',
                  firstName: 'James',
                  lastName: 'Doe',
                  phone: '92374162212',
                  tags: ['Test_User', 'Interested_User', 'DIY_Hobby'],
                  fieldInfo: {
                    Office: 'Trastkiv',
                    Country: 'Russia',
                    Likes: ['Potato', 'Onion'],
                    Random: 'random',
                  },
                  lists: [
                    {
                      id: 2,
                      status: 'subscribe',
                    },
                    {
                      id: 3,
                      status: 'unsubscribe',
                    },
                    {
                      id: 3,
                      status: 'unsubscribexyz',
                    },
                  ],
                  address: {
                    city: 'kolkata',
                    country: 'India',
                    postalCode: 789223,
                    state: 'WB',
                    street: '',
                  },
                },
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T09:03:22.563Z',
              },
            },
            {
              destination: {
                Config: {
                  apiKey: 'dummyApiToken',
                  apiUrl: 'https://active.campaigns.rudder.com',
                  actid: '476550467',
                  eventKey: 'f8a866fddc721350fdc2fbbd2e5c43a6dddaaa03',
                },
              },
              metadata: {
                jobId: 2,
              },
              message: {
                channel: 'web',
                context: {
                  app: {
                    build: '1.0.0',
                    name: 'RudderLabs JavaScript SDK',
                    namespace: 'com.rudderlabs.javascript',
                    version: '1.0.0',
                  },
                  traits: {
                    email: 'jamesDoe@gmail.com',
                    anonymousId: '12345',
                  },
                  library: {
                    name: 'RudderLabs JavaScript SDK',
                    version: '1.0.0',
                  },
                  userAgent:
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
                  locale: 'en-US',
                  os: {
                    name: '',
                    version: '',
                  },
                  screen: {
                    density: 2,
                  },
                },
                request_ip: '1.1.1.1',
                type: 'page',
                messageId: '5e10d13a-bf9a-44bf-b884-43a9e591ea71',
                session_id: '3049dc4c-5a95-4ccd-a3e7-d74a7e411f22',
                originalTimestamp: '2019-10-14T11:15:18.299Z',
                anonymousId: '00000000000000000000000000',
                userId: '12345',
                properties: {
                  name: 'ApplicationLoaded',
                  path: '/test',
                  referrer: 'Rudder',
                  search: 'abc',
                  title: 'Test Page',
                  url: 'https://www.rudderlabs.com',
                },
                integrations: {
                  All: true,
                },
                sentAt: '2019-10-14T11:15:53.296Z',
              },
            },
          ],
          destType: 'active_campaign',
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: {
                body: {
                  XML: {},
                  FORM: {},
                  JSON_ARRAY: {},
                  JSON: {
                    contact: {
                      email: 'jamesDoe@gmail.com',
                      firstName: 'James',
                      lastName: 'Doe',
                      phone: '92374162212',
                      fieldValues: [
                        {
                          field: '0',
                          value: 'Trastkiv',
                        },
                        {
                          field: '1',
                          value: 'Russia',
                        },
                        {
                          field: '3',
                          value: '||Potato||Onion||',
                        },
                        {
                          field: '4',
                          value: 'random',
                        },
                      ],
                    },
                  },
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                headers: {
                  'Api-Token': 'dummyApiToken',
                  'Content-Type': 'application/json',
                },
                version: '1',
                endpoint: 'https://active.campaigns.rudder.com/api/3/contact/sync',
              },
              metadata: [
                {
                  jobId: 2,
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  apiKey: 'dummyApiToken',
                  apiUrl: 'https://active.campaigns.rudder.com',
                  actid: '476550467',
                  eventKey: 'f8a866fddc721350fdc2fbbd2e5c43a6dddaaa03',
                },
              },
            },
            {
              batchedRequest: {
                body: {
                  XML: {},
                  FORM: {},
                  JSON_ARRAY: {},
                  JSON: {
                    contact: {
                      email: 'jamesDoe@gmail.com',
                      firstName: 'James',
                      lastName: 'Doe',
                      phone: '92374162212',
                      fieldValues: [
                        {
                          field: '0',
                          value: 'Trastkiv',
                        },
                        {
                          field: '1',
                          value: 'Russia',
                        },
                        {
                          field: '3',
                          value: '||Potato||Onion||',
                        },
                        {
                          field: '4',
                          value: 'random',
                        },
                      ],
                    },
                  },
                },
                type: 'REST',
                files: {},
                method: 'POST',
                params: {},
                headers: {
                  'Api-Token': 'dummyApiToken',
                  'Content-Type': 'application/json',
                },
                version: '1',
                endpoint: 'https://active.campaigns.rudder.com/api/3/contact/sync',
              },
              metadata: [
                {
                  jobId: 2,
                },
              ],
              batched: false,
              statusCode: 200,
              destination: {
                Config: {
                  apiKey: 'dummyApiToken',
                  apiUrl: 'https://active.campaigns.rudder.com',
                  actid: '476550467',
                  eventKey: 'f8a866fddc721350fdc2fbbd2e5c43a6dddaaa03',
                },
              },
            },
          ],
        },
      },
    },
  },
];

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
  fs.writeFileSync('test_reports/test-report.html', htmlTemplate);
  console.log('Report initialised');
};

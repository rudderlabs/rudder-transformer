const fs = require('fs');

let input;
let output;

const makeCall = async (data, destination) => {
  var axios = require('axios');
  var data = JSON.stringify([data]);

  var config = {
    method: 'post',
    url: `http://localhost:9090/v0/destinations/${destination}`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };
  let res = undefined;
  await axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      res = response.data;
    })
    .catch(function (error) {
      console.log(error);
      res = response.data;
    });
  return res;
};

async function generateFile() {
  const newType = !fs.existsSync(
    `/Users/sanjayv/Desktop/automation/rudder-transformer/test/__tests__/data/${process.argv[2]}_router_input.json`,
  );
  input = JSON.parse(
    !newType
      ? fs.readFileSync(
          `/Users/sanjayv/Desktop/automation/rudder-transformer/test/__tests__/data/${process.argv[2]}_router_input.json`,
          (err, data) => {
            if (err) {
              throw err;
            }
            input = data;
            // console.log(data.toString());
          },
        )
      : fs.readFileSync(
          `/Users/sanjayv/Desktop/automation/rudder-transformer/test/__tests__/data/${process.argv[2]}_router.json`,
          (err, data) => {
            if (err) {
              throw err;
            }
            input = data;
            // console.log(data.toString());
          },
        ),
  );

  //   output = JSON.parse(
  //     fs.readFileSync(
  //       `/Users/sanjayv/Desktop/automation/rudder-transformer/test/__tests__/data/${process.argv[2]}_output.json`,
  //       (err, data) => {
  //         if (err) {
  //           throw err;
  //         }
  //         output = data;
  //       },
  //     ),
  //   );

  let outputData = [];

  const dataFormat = {
    name: `${process.argv[2]}`,
    description: '',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [],
      },
    },
    output: {
      response: {
        status: 200,
        body: [],
      },
    },
  };
  const errOutputBody = {
    error: '',
    statTags: {
      destType: `${process.argv[2]}`,
      errorCategory: 'dataValidation',
      errorType: 'instrumentation',
      feature: 'processor',
      implementation: 'native',
      module: 'destination',
    },
    statusCode: 400,
  };
  const succOutputBody = {
    output: {},
    statusCode: 200,
  };

  for (let index = 0; index < input.length; index++) {
    let element;
    if (newType) element = input[index].input;
    else element = input[index];
    const tempOutput = JSON.parse(JSON.stringify(dataFormat));
    tempOutput.description = 'Test ' + index;
    tempOutput.input.request.body.push(element);
    // if (output[index].message) {
    //   const tempErrOutputBody = JSON.parse(JSON.stringify(errOutputBody));
    //   tempErrOutputBody.error = output[index].message;
    //   tempOutput.output.response.body.push(tempErrOutputBody);
    // } else {
    //   const tempSuccOutputBody = JSON.parse(JSON.stringify(succOutputBody));
    //   tempSuccOutputBody.output = output[index];
    //   tempSuccOutputBody.output.userId = '';
    //   tempSuccOutputBody.metadata = element.metadata;
    // }
    tempOutput.output.response.body = await makeCall(element, process.argv[2]);
    outputData.push(tempOutput);
  }

  //   await input.forEach(async (element, index) => );

  //   console.log(outputData);
  const outputStr = `export const data = ${JSON.stringify(outputData, null, '\t')}`;

  if (
    !fs.existsSync(
      `/Users/sanjayv/Desktop/automation/rudder-transformer/test/integrations/destinations/${process.argv[2]}`,
    )
  ) {
    fs.mkdirSync(
      `/Users/sanjayv/Desktop/automation/rudder-transformer/test/integrations/destinations/${process.argv[2]}`,
    );
  }
  if (
    !fs.existsSync(
      `/Users/sanjayv/Desktop/automation/rudder-transformer/test/integrations/destinations/${process.argv[2]}/router`,
    )
  ) {
    fs.mkdirSync(
      `/Users/sanjayv/Desktop/automation/rudder-transformer/test/integrations/destinations/${process.argv[2]}/router`,
    );
  }

  fs.writeFileSync(
    `/Users/sanjayv/Desktop/automation/rudder-transformer/test/integrations/destinations/${process.argv[2]}/router/data.ts`,
    outputStr,
  );
}
generateFile().then(() => {
  console.log('Succeeded');
});
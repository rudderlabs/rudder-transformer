const fs = require("fs");

const destination = 'slack';
let input;
let output;
async function generateFile() {
  input = JSON.parse(
    fs.readFileSync(
      `/Users/sanjayv/Desktop/automation/rudder-transformer/test/__tests__/data/${destination}_router_input.json`,
      (err, data) => {
        if (err) {
          throw err;
        }
        input = data;
        // console.log(data.toString());
      }
    )
  );
  output = JSON.parse(
    fs.readFileSync(
      `/Users/sanjayv/Desktop/automation/rudder-transformer/test/__tests__/data/${destination}_router_output.json`,
      (err, data) => {
        if (err) {
          throw err;
        }
        output = data;
      }
    )
  );

  let outputData = [];

  const dataFormat = {
    name: `${destination}`,
    description: "",
    feature: "processor",
    module: "destination",
    version: "v0",
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
    error: "",
    statTags: {
      destType: `${destination}`,
      errorCategory: "dataValidation",
      errorType: "instrumentation",
      feature: "processor",
      implementation: "native",
      module: "destination",
    },
    statusCode: 400,
  };
  const succOutputBody = {
    output: {},
    statusCode: 200,
  };

  input.forEach((element, index) => {
    const tempOutput = JSON.parse(JSON.stringify(dataFormat));
    tempOutput.description = "Test " + index;
    tempOutput.input.request.body.push(element);
    if (output[index].message) {
      const tempErrOutputBody = JSON.parse(JSON.stringify(errOutputBody));
      tempErrOutputBody.error = output[index].message;
      tempOutput.output.response.body.push(tempErrOutputBody);
    } else {
      const tempSuccOutputBody = JSON.parse(JSON.stringify(succOutputBody));
      tempSuccOutputBody.output = output[index];
      tempOutput.output.response.body.push(tempSuccOutputBody);
    }
    outputData.push(tempOutput);
  });

  console.log(outputData);
  const outputStr = `export const data = ${JSON.stringify(
    outputData,
    null,
    "\t"
  )}`;

  // fs.mkdirSync(
  //   `/Users/sanjayv/Desktop/automation/rudder-transformer/test/integrations/destinations/${destination}`
  // );
  // fs.mkdirSync(
  //   `/Users/sanjayv/Desktop/automation/rudder-transformer/test/integrations/destinations/${destination}/router`
  // );

  fs.writeFileSync(
    `/Users/sanjayv/Desktop/automation/rudder-transformer/test/integrations/destinations/${destination}/router/data.ts`,
    outputStr
  );
}
generateFile().then(() => {
  console.log("Succeeded");
});
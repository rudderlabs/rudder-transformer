const {
  PersonalizeClient,
  CreateDatasetGroupCommand,
  DescribeDatasetGroupCommand,
  CreateSchemaCommand,
  CreateDatasetCommand,
  DescribeDatasetCommand,
  CreateEventTrackerCommand,
} = require('@aws-sdk/client-personalize');
const { fromEnv } = require('@aws-sdk/credential-providers');

const readline = require('readline');
let rl = readline.createInterface(process.stdin, process.stdout);

function promtForInput(questionText, envName) {
  if (!process.env[envName]) {
    rl.question(questionText, (input) => (process.env[envName] = input));
  }
}
// get inputs from user
promtForInput('AWS Access Key ID: ', 'AWS_ACCESS_KEY_ID');
promtForInput('AWS Secret Access Key: ', 'AWS_SECRET_ACCESS_KEY');
promtForInput('AWS REGION: ', 'AWS_REGION');
promtForInput('Name of Dataset Group:', 'DATASET_GROUP_NAME');
promtForInput(
  'Number of fields in Schema in addition to USER_ID, TIMESTAMP, ITEM_ID: ',
  'NUMBER_OF_FIELDS',
);
rl.close();
const datasetGroup = process.env.DATASET_GROUP_NAME;
const columns = [];
const type = [];

// eslint-disable-next-line radix
const noOfFields = parseInt(process.env.NUMBER_OF_FIELDS);
columns[0] = 'USER_ID';
columns[1] = 'ITEM_ID';
columns[2] = 'TIMESTAMP';
type[0] = 'string';
type[1] = 'string';
type[2] = 'long';

for (let i = 4; i <= noOfFields + 3; i += 1) {
  columns[i - 1] = readline.question(`Name of field no. ${i}: `);
  type[i - 1] = readline.question(`Type of field ${columns[i - 1]}: `);
}

let schema = {
  type: 'record',
  name: 'Interactions',
  namespace: 'com.amazonaws.personalize.schema',
  fields: [
    { name: 'USER_ID', type: 'string' },
    { name: 'ITEM_ID', type: 'string' },
    { name: 'TIMESTAMP', type: 'long' },
  ],
  version: '1.0',
};

if (noOfFields > 0) {
  for (let i = 3; i < noOfFields + 3; i += 1) {
    schema.fields.push({ name: columns[i], type: type[i] });
  }
}

(async function () {
  try {
    const client = new PersonalizeClient({
      region: process.env.AWS_REGION,
      credentials: fromEnv(),
    });

    // create the objects needed for personalize
    const createDatasetGroupCommand = new CreateDatasetGroupCommand({
      name: `${datasetGroup}_DataSetGroup`,
    });

    const responseDatasetGroup = await client.send(createDatasetGroupCommand);
    const { datasetGroupArn } = responseDatasetGroup;

    // describe dataset group
    console.log(datasetGroupArn);

    const describeDatasetGroupCommand = new DescribeDatasetGroupCommand({
      datasetGroupArn,
    });

    let responseDescribeDSGroup = await client.send(describeDatasetGroupCommand);
    let statusDSGroup = responseDescribeDSGroup.datasetGroup.status;

    // schema
    const createSchemaCommand = new CreateSchemaCommand({
      name: `${datasetGroup}_schema`,
      schema: JSON.stringify(schema),
    });

    const responseSchema = await client.send(createSchemaCommand);
    const { schemaArn } = responseSchema;

    // dataset
    while (statusDSGroup !== 'ACTIVE') {
      responseDescribeDSGroup = await client.send(describeDatasetGroupCommand);
      statusDSGroup = responseDescribeDSGroup.datasetGroup.status;
    }

    const createDatasetCommand = new CreateDatasetCommand({
      datasetGroupArn,
      datasetType: 'Interactions',
      name: `${datasetGroup}_dataset`,
      schemaArn,
    });

    const responseDataset = await client.send(createDatasetCommand);
    const { datasetArn } = responseDataset;

    // describe dataset
    const describeDatasetCommand = new DescribeDatasetCommand({
      datasetArn,
    });

    let responseDescribeDS = await client.send(describeDatasetCommand);
    let statusDS = responseDescribeDS.dataset.status;

    while (statusDS !== 'ACTIVE') {
      responseDescribeDS = await client.send(describeDatasetCommand);
      statusDS = responseDescribeDS.dataset.status;
    }

    // event tracker
    const createEventTrackerCommand = new CreateEventTrackerCommand({
      datasetGroupArn,
      name: `${datasetGroup}_eventtracker`,
    });

    const responseEventTracker = await client.send(createEventTrackerCommand);
    const { trackingId } = responseEventTracker;

    return trackingId;
  } catch (e) {
    let errMsg;
    if (e.name === 'InvalidInputException') {
      errMsg =
        'Wrong type of field. Types can be of: null, boolean, int, long, float, double, bytes, and string.Try Again.';
      return errMsg;
    }
    if (e.name === 'ResourceAlreadyExistsException') {
      errMsg = 'Please try another name. Dataset Group or Schema with this name already exists';
      return errMsg;
    }
    if (e.name === 'UnrecognizedClientException') {
      errMsg = 'Please check your access id';
      return errMsg;
    }
    if (e.name === 'InvalidSignatureException') {
      errMsg = 'Please check your secret id';
      return errMsg;
    }
    if (e.name === 'NetworkingError') {
      errMsg = 'Please check your region';
      return errMsg;
    }
    return e;
  }
})().then((result) => {
  console.log(result);
});

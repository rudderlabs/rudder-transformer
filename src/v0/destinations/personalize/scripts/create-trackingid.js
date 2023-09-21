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

require('dotenv').config()

async function promtForInput(rl, questionText) {
  return new Promise((resolve) => {
    rl.question(questionText, (input) => {
      resolve(input);
    });
  });
}

async function checkEnvAndpromtForInput(rl, questionText, envVar) {
  if (process.env[envVar]) {
    return;
  }
  process.env[envVar] = await promtForInput(rl, questionText);
}

async function collectInputs(rl) {
  await checkEnvAndpromtForInput(rl, 'AWS Access Key ID: ', 'AWS_ACCESS_KEY_ID');
  await checkEnvAndpromtForInput(rl, 'AWS Secret Access Key: ', 'AWS_SECRET_ACCESS_KEY');
  await checkEnvAndpromtForInput(rl, 'AWS REGION: ', 'AWS_REGION');
  await checkEnvAndpromtForInput(rl, 'Name of Dataset Group: ', 'DATASET_GROUP_NAME');
  await checkEnvAndpromtForInput(rl,
    'Number of fields in Schema in addition to USER_ID, TIMESTAMP, ITEM_ID: ',
    'NUMBER_OF_FIELDS',
  );
}

async function collectFileds(rl) {
  const noOfFields = parseInt(process.env.NUMBER_OF_FIELDS);
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

  for (let i = 4; i <= noOfFields + 3; i += 1) {
    const fieldName = await promtForInput(rl, `Name of field no. ${i}: `);
    const typeName = await promtForInput(rl, `Type of field ${fieldName}: `)
    schema.fields.push({ name: fieldName, type: typeName });

  }
  return schema;
}


(async function () {
  let rl = readline.createInterface(process.stdin, process.stdout);
  await collectInputs(rl);
  const schema = await collectFileds(rl);
  rl.close();
  const datasetGroup = process.env.DATASET_GROUP_NAME;
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

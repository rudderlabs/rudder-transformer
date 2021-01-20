/* eslint-disable no-await-in-loop */
const AWS = require("aws-sdk");
const readline = require("readline-sync");

// get inputs from user

const accessKeyId = readline.question("Access Key ID ");
const secretAccessKey = readline.question("Secret Access Key ");
const region = readline.question("Region ");
const name = readline.question("Name of Dataset Group ");
let noOfFields = readline.question(
  "Number of fields in Schema in addition to USER_ID, TIMESTAMP,ITEM_ID "
);

const columns = [];
const type = [];
// eslint-disable-next-line radix
noOfFields = parseInt(noOfFields);
let i;
columns[0] = "USER_ID";
columns[1] = "ITEM_ID";
columns[2] = "TIMESTAMP";
type[0] = "string";
type[1] = "string";
type[2] = "long";

for (i = 4; i <= noOfFields + 3; i++) {
  columns[i - 1] = readline.question(`Name of field no. ${i}`);
  type[i - 1] = readline.question(`Type of field ${columns[i - 1]} `);
}

let schema =
  '{"type": "record","name": "Interactions","namespace": "com.amazonaws.personalize.schema","fields": [{"name": "USER_ID","type": "string"},{"name": "ITEM_ID","type": "string"},{"name": "TIMESTAMP","type": "long" }'; // ], "version": "1.0"}'

if (noOfFields > 0) {
  for (i = 3; i < noOfFields + 3; i++) {
    schema = `${schema},{"name": "${columns[i]}","type": "${type[i]}"}`;
  }
}
schema += '], "version": "1.0"}';

(async function() {
  try {
    AWS.config.update({
      accessKeyId,
      secretAccessKey,
      region
    });

    // create the objects needed for personalize

    const personalize = new AWS.Personalize();

    // datasetgroup

    const paramsCreateDatasetGroup = {
      name: `${name}_DataSetGroup` /* required */
    };

    const responseDatasetGroup = await personalize
      .createDatasetGroup(paramsCreateDatasetGroup)
      .promise();

    const { datasetGroupArn } = responseDatasetGroup;

    // describe dataset group

    const paramsDescribeDatasetGroup = {
      datasetGroupArn /* required */
    };

    let responseDescribeDSGroup = await personalize
      .describeDatasetGroup(paramsDescribeDatasetGroup)
      .promise();

    let statusDSGroup = responseDescribeDSGroup.datasetGroup.status;

    // schema

    const paramsSchema = {
      name: `${name}_schema` /* required */,
      schema
      /* required */
    };

    const responseSchema = await personalize
      .createSchema(paramsSchema)
      .promise();

    const { schemaArn } = responseSchema;

    // dataset

    while (statusDSGroup !== "ACTIVE") {
      responseDescribeDSGroup = await personalize
        .describeDatasetGroup(paramsDescribeDatasetGroup)
        .promise();
      statusDSGroup = responseDescribeDSGroup.datasetGroup.status;
    }

    const paramsDataset = {
      datasetGroupArn /* required */,
      datasetType: "Interactions" /* required */,
      name: `${name}_dataset` /* required */,
      schemaArn /* required */
    };

    const responseDataset = await personalize
      .createDataset(paramsDataset)
      .promise();

    const { datasetArn } = responseDataset;

    // describe dataset

    const paramsDescribeDataset = {
      datasetArn
    };

    let responseDescribeDS = await personalize
      .describeDataset(paramsDescribeDataset)
      .promise();
    let statusDS = responseDescribeDS.dataset.status;
    while (statusDS !== "ACTIVE") {
      responseDescribeDS = await personalize
        .describeDataset(paramsDescribeDataset)
        .promise();
      statusDS = responseDescribeDS.dataset.status;
    }

    // event tracker
    const paramsEventTracker = {
      datasetGroupArn /* required */,
      name: `${name}_eventtracker` /* required */
    };

    const responseEventTracker = await personalize
      .createEventTracker(paramsEventTracker)
      .promise();
    const { trackingId } = responseEventTracker;

    return trackingId;
  } catch (e) {
    let errMsg;
    if (e.code === "InvalidInputException") {
      errMsg =
        "Wrong type of field. Types can be of: null, boolean, int, long, float, double, bytes, and string.Try Again.";
      if (statusDSGroup === "ACTIVE") {
        const params = {
          datasetGroupArn /* required */
        };
        await personalize.deleteDatasetGroup(params).promise();
      }
      return errMsg;
    }
    if (e.code === "ResourceAlreadyExistsException") {
      errMsg =
        "Please try another name. Dataset Group or Schema with this name already exists";
      return errMsg;
    }
    if (e.code === "UnrecognizedClientException") {
      errMsg = "Please check your access id";
      return errMsg;
    }
    if (e.code === "InvalidSignatureException") {
      errMsg = "Please check your secret id";
      return errMsg;
    }
    if (e.code === "NetworkingError") {
      errMsg = "Please check your region";
      return errMsg;
    }
    return e;
  }
})().then(result => {});

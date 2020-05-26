/* eslint-disable no-await-in-loop */
var AWS = require("aws-sdk");
var readline = require("readline-sync");

// get inputs from user

const accessKeyId = readline.question("Access Key ID ");
const secretAccessKey = readline.question("Secret Access Key ");
const region = readline.question("Region ");
const name = readline.question("Name of Dataset Group ");
var noOfFields = readline.question(
  "Number of fields in Schema in addition to USER_ID, TIMESTAMP,ITEM_ID "
);

var columns = [];
var type = [];
// eslint-disable-next-line radix
noOfFields = parseInt(noOfFields);
var i;
columns[0] = "USER_ID";
columns[1] = "ITEM_ID";
columns[2] = "TIMESTAMP";
type[0] = "string";
type[1] = "string";
type[2] = "long";

for (i = 4; i <= noOfFields + 3; i++) {
  columns[i - 1] = readline.question("Name of field no. " + i);
  type[i - 1] = readline.question("Type of field " + columns[i - 1] + " ");
}
console.log("Your fields and their types for the schema: ");
console.log(columns);
console.log(type);

var schema =
  '{"type": "record","name": "Interactions","namespace": "com.amazonaws.personalize.schema","fields": [{"name": "USER_ID","type": "string"},{"name": "ITEM_ID","type": "string"},{"name": "TIMESTAMP","type": "long" }'; // ], "version": "1.0"}'

if (noOfFields > 0) {
  for (i = 3; i < noOfFields + 3; i++) {
    schema =
      schema + ',{"name": "' + columns[i] + '","type": "' + type[i] + '"}';
  }
}
schema += '], "version": "1.0"}';
console.log("Your schema: ");
console.log(schema);

(async function() {
  try {
    console.log("Updating Config");

    AWS.config.update({
      accessKeyId,
      secretAccessKey,
      region
    });

    console.log("Updating Config done");

    // create the objects needed for personalize

    var personalize = new AWS.Personalize();

    // datasetgroup

    console.log("Creation of Dataset group ARN started");

    var paramsCreateDatasetGroup = {
      name: name + "_DataSetGroup" /* required */
    };

    const responseDatasetGroup = await personalize
      .createDatasetGroup(paramsCreateDatasetGroup)
      .promise();

    const datasetGroupArn = responseDatasetGroup.datasetGroupArn;

    console.log("Creation of Dataset group ARN  done");
    console.log("Your Dataset Group ARN: ");
    console.log(datasetGroupArn);

    // describe dataset group

    var paramsDescribeDatasetGroup = {
      datasetGroupArn /* required */
    };

    let responseDescribeDSGroup = await personalize
      .describeDatasetGroup(paramsDescribeDatasetGroup)
      .promise();

    var statusDSGroup = responseDescribeDSGroup.datasetGroup.status;

    // schema

    console.log("Creation of schema ARN started");

    var paramsSchema = {
      name: name + "_schema" /* required */,
      schema
      /* required */
    };

    const responseSchema = await personalize
      .createSchema(paramsSchema)
      .promise();

    const schemaArn = responseSchema.schemaArn;

    console.log("Creation of Schema ARN  done");
    console.log("Your Schema ARN: ");
    console.log(schemaArn);

    // dataset

    while (statusDSGroup != "ACTIVE") {
      console.log("Status of Dataset Group Creation");
      console.log(statusDSGroup);
      responseDescribeDSGroup = await personalize
        .describeDatasetGroup(paramsDescribeDatasetGroup)
        .promise();
      statusDSGroup = responseDescribeDSGroup.datasetGroup.status;
    }

    console.log("Status of Dataset Group Creation:  ACTIVE");

    console.log("Creation of Dataset  ARN  started");

    var paramsDataset = {
      datasetGroupArn /* required */,
      datasetType: "Interactions" /* required */,
      name: name + "_dataset" /* required */,
      schemaArn /* required */
    };

    const responseDataset = await personalize
      .createDataset(paramsDataset)
      .promise();

    const datasetArn = responseDataset.datasetArn;

    console.log("Creation of Dataset ARN  done");
    console.log("Your Dataset ARN: ");
    console.log(datasetArn);

    // describe dataset

    var paramsDescribeDataset = {
      datasetArn
    };

    let responseDescribeDS = await personalize
      .describeDataset(paramsDescribeDataset)
      .promise();
    var statusDS = responseDescribeDS.dataset.status;
    while (statusDS != "ACTIVE") {
      console.log("Status of Dataset Creation");
      console.log(statusDS);
      responseDescribeDS = await personalize
        .describeDataset(paramsDescribeDataset)
        .promise();
      statusDS = responseDescribeDS.dataset.status;
    }
    console.log("Status of Dataset Creation:  ACTIVE");

    // event tracker
    console.log("Creation of Event tracker tracking id  started");
    var paramsEventTracker = {
      datasetGroupArn /* required */,
      name: name + "_eventtracker" /* required */
    };

    const responseEventTracker = await personalize
      .createEventTracker(paramsEventTracker)
      .promise();
    const eventTrackerArn = responseEventTracker.eventTrackerArn;
    const trackingId = responseEventTracker.trackingId;
    console.log("Creation of Event tracker tracking id done");
    console.log("Your Event Tracker ARN: ");
    console.log(eventTrackerArn);
    console.log("Your Tracking Id: ");
    console.log(trackingId);
    console.log(
      "Use this tracking ID to create destination for AWS Personalize in RudderStack"
    );

    return trackingId;
  } catch (e) {
    var err_msg;
    console.log(e.code);
    if (e.code == "InvalidInputException") {
      err_msg =
        "Wrong type of field. Types can be of: null, boolean, int, long, float, double, bytes, and string.Try Again.";
      if (statusDSGroup == "ACTIVE") {
        var params = {
          datasetGroupArn /* required */
        };
        await personalize.deleteDatasetGroup(params).promise();
      }
      return err_msg;
    }
    if (e.code == "ResourceAlreadyExistsException") {
      err_msg =
        "Please try another name. Dataset Group or Schema with this name already exists";
      return err_msg;
    }
    if (e.code == "UnrecognizedClientException") {
      err_msg = "Please check your access id";
      return err_msg;
    }
    if (e.code == "InvalidSignatureException") {
      err_msg = "Please check your secret id";
      return err_msg;
    }
    if (e.code == "NetworkingError") {
      err_msg = "Please check your region";
      return err_msg;
    }
    return e;
  }
})().then(result => {
  console.log(result);
});

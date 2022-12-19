import KoaRouter from "koa-router";
import fs from "fs";
import { Upload } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";
import moment from "moment";
import v8 from "v8";

import pprof from "pprof";
import { promisify } from "util";

const writeFileProm = promisify(fs.writeFile);

// The average number of bytes between samples.
// 512*1024 = 524288
const intervalBytes = parseInt(process.env.PROF_INTERVAL_BYTES || "524288", 10);

// The maximum stack depth for samples collected.
const stackDepth = parseInt(process.env.PROF_STACK_DEPTH || "64", 10);

console.log(`Stack Depth set: ${stackDepth}`);
console.log(`Interval Bytes set: ${intervalBytes}`);

pprof.heap.start(intervalBytes, stackDepth);

const router = new KoaRouter();

const uploadToAWS = async (credBucketDetails, fileName, readStream) => {
  const storageClient = new S3Client({
    credentials: {
      accessKeyId: credBucketDetails.accessKeyId,
      secretAccessKey: credBucketDetails.secretAccessKey
    },
    region: credBucketDetails.region
  });
  const params = {
    Bucket: credBucketDetails.bucket,
    Key: fileName,
    Body: readStream
  };
  const upload = new Upload({
    client: storageClient,
    params
  });

  upload.on("httpUploadProgress", progress => {
    console.log(progress);
  });

  const uploadResult = await upload.done();
  return uploadResult;
};

const promisifiedRead = readable => {
  return new Promise((resolve, reject) => {
    // Instructions for reading data
    const chunks = [];
    readable.on("readable", () => {
      let chunk;
      // Using while loop and calling
      // read method with parameter
      while (true) {
        // Displaying the chunk
        chunk = readable.read();
        if (chunk === null) {
          break;
        }
        chunks.push(chunk);
      }
      resolve(Buffer.concat(chunks).toString());
    });
    readable.on("error", err => {
      console.error(err);
      reject(err);
    });
  });
};

/**
 * Example usage of API
 * 
 * Should have PutS3Object permission for the bucket mentioned
    curl --location --request POST 'http://localhost:9090/heapdump' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "sendTo": "aws",
        "accessKeyId": "<AWS_ACCESS_KEY>",
        "secretAccessKey": "<AWS_SECRET_ACCESS_KEY>",
        "bucket": "<S3_BUCKET_NAME>",
        "region": "<AWS_REGION>"
    }'

  * Another way -- To get the heapdump in v8 format
    curl --location --request POST 'http://localhost:9090/heapdump?format=v8' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "sendTo": "aws",
        "accessKeyId": "<AWS_ACCESS_KEY>",
        "secretAccessKey": "<AWS_SECRET_ACCESS_KEY>",
        "bucket": "<S3_BUCKET_NAME>",
        "region": "<AWS_REGION>"
    }'
 */
const profile = async (credBucketDetails: any, profileformat: string) => {
  let response;
  let snapshotReadableStream;
  try {
    const supportedCloudProvidersForDumpStorage = ["aws"];
    const shouldGenerateLocally = !credBucketDetails.sendTo;
    console.log("Before Heapsnapshot converted into a readable stream");
    let fileName = "";
    let format = "pb.gz";
    let profile;
    if (profileformat === "v8") {
      const readable = v8.getHeapSnapshot();
      snapshotReadableStream = await promisifiedRead(readable);
      format = "heapsnapshot";
    } else {
      profile = await pprof.heap.profile();
      snapshotReadableStream = await pprof.encode(profile);
    }

    console.log("Heapsnapshot into a buffer");
    fileName = `heap_${moment
      .utc()
      .format("YYYY-MM-DD_HH:mm:ss.sss")}.${format}`;
    let data;
    if (shouldGenerateLocally) {
      console.log("Before pipeline");
      try {
        await writeFileProm(fileName, snapshotReadableStream);
      } catch (error) {
        console.error("Error occurred:", error);
        throw new Error(error);
      }
      console.log("After pipeline");
    } else if (credBucketDetails.sendTo) {
      switch (credBucketDetails.sendTo) {
        case "aws":
          data = await uploadToAWS(
            credBucketDetails,
            fileName,
            snapshotReadableStream
          );
          break;
        default:
          throw new Error(
            `un-supported cloud provider, only these are supported currently(${supportedCloudProvidersForDumpStorage.join(
              ", "
            )}) `
          );
      }
    }
    // snapshotReadableStream.destroy();
    console.log("Success", data);
    response.body = `Generated ${
      credBucketDetails.sendTo ? credBucketDetails.sendTo : "locally"
    } with filename: ${fileName}`;
    response.status = 200;
  } catch (error) {
    console.error(error);
    response.body = error.message;
    response.status = 400;
  } finally {
    // if (snapshotReadableStream) {
    //   snapshotReadableStream.destroy();
    // }
  }
  return response;
};

export default profile;


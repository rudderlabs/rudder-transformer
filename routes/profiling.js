const KoaRouter = require("koa-router");
const fs = require("fs");
const { Upload } = require("@aws-sdk/lib-storage");
const { S3Client } = require("@aws-sdk/client-s3");
const moment = require("moment");
const v8 = require("v8");

const pprof = require("pprof");

// The average number of bytes between samples.
// 512*1024 = 524288
const intervalBytes = parseInt(process.env.PROF_INTERVAL_BYTES || "524288", 10);

// The maximum stack depth for samples collected.
const stackDepth = parseInt(process.env.PROF_STACK_DEPTH || "64", 10);

console.log(`Stack Depth set: ${stackDepth}`);
console.log(`Interval Bytes set: ${intervalBytes}`);

pprof.heap.start(intervalBytes, stackDepth);

const router = new KoaRouter();

const promisifedWrite = (readStream, writeFileName) => {
  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(writeFileName);
    readStream.pipe(writeStream);
    readStream.on("error", err => {
      reject(err);
    });
    writeStream.on("finish", () => {
      resolve();
    });
    writeStream.on("error", err => {
      reject(err);
    });
  });
};

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
 */
router.post("/heapdump", async ctx => {
  let snapshotReadableStream;
  try {
    const supportedCloudProvidersForDumpStorage = ["aws"];
    const credBucketDetails = ctx.request.body;
    const shouldGenerateLocally = !credBucketDetails.sendTo;
    console.log("Before Heapsnapshot converted into a readable stream");
    // snapshotReadableStream = v8.getHeapSnapshot();

    const profile = await pprof.heap.profile();
    snapshotReadableStream = await pprof.encode(profile);

    console.log("Heapsnapshot into a readable stream");
    const fileName = `heap_${moment.utc().format("DDMMYYYY:ss.sss")}.pb.gz`;
    let data;
    if (shouldGenerateLocally) {
      console.log("Before pipeline");
      let afterPipeline;
      try {
        afterPipeline = await promisifedWrite(snapshotReadableStream, fileName);
      } catch (error) {
        console.error("Error occurred");
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
    ctx.body = `Generated locally with filename: ${fileName}`;
  } catch (error) {
    ctx.status = 400;
    ctx.body = error.message;
  } finally {
    // if (snapshotReadableStream) {
    //   snapshotReadableStream.destroy();
    // }
  }
});

module.exports = router.routes();

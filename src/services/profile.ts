import fs from 'fs';
import { Upload } from '@aws-sdk/lib-storage';
import { S3Client } from '@aws-sdk/client-s3';
import moment from 'moment';
import v8 from 'v8';

import pprof, { heap } from '@datadog/pprof';
import { promisify } from 'util';
import logger from '../logger';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CatchErr } from '../util/types';

// The average number of bytes between samples.
// 512*1024 = 524288
const intervalBytes = parseInt(process.env.PROF_INTERVAL_BYTES || '524288', 10);

// The maximum stack depth for samples collected.
const stackDepth = parseInt(process.env.PROF_STACK_DEPTH || '64', 10);

logger.info(`Stack Depth set: ${stackDepth}`);
logger.info(`Interval Bytes set: ${intervalBytes}`);

heap.start(intervalBytes, stackDepth);

export default class ProfileService {
  private static async promisifiedRead(readable: any) {
    // eslint-disable-next-line no-new
    new Promise((resolve, reject) => {
      // Instructions for reading data
      const chunks: any[] = [];
      readable.on('readable', () => {
        let chunk;
        // Using while loop and calling
        // read method with parameter
        // eslint-disable-next-line no-constant-condition
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
      readable.on('error', (err) => {
        logger.error(err);
        reject(err);
      });
    });
  }

  private static async uploadToAWS(credBucketDetails: any, fileName: any, readStream: any) {
    const storageClient = new S3Client({
      credentials: {
        accessKeyId: credBucketDetails.accessKeyId,
        secretAccessKey: credBucketDetails.secretAccessKey,
      },
      region: credBucketDetails.region,
    });
    const params = {
      Bucket: credBucketDetails.bucket,
      Key: fileName,
      Body: readStream,
    };
    const upload = new Upload({
      client: storageClient,
      params,
    });

    upload.on('httpUploadProgress', (progress) => {
      logger.info(progress);
    });

    const uploadResult = await upload.done();
    return uploadResult;
  }

  public static async profile(credBucketDetails: any, format: string) {
    const writeFileProm = promisify(fs.writeFile);
    let snapshotReadableStream;
    try {
      const supportedCloudProvidersForDumpStorage = ['aws'];
      const shouldGenerateLocally = !credBucketDetails.sendTo;
      logger.info('Before Heapsnapshot converted into a readable stream');
      let fileName = '';
      // eslint-disable-next-line no-param-reassign
      format = 'pb.gz';
      let profile;
      if (format && format === 'v8') {
        const readable = v8.getHeapSnapshot();
        snapshotReadableStream = await this.promisifiedRead(readable);
        // eslint-disable-next-line no-param-reassign
        format = 'heapsnapshot';
      } else {
        profile = heap.profile();
        snapshotReadableStream = await pprof.encode(profile);
      }

      logger.info('Heapsnapshot into a buffer');
      fileName = `heap_${moment.utc().format('YYYY-MM-DD_HH:mm:ss.sss')}.${format}`;
      let data;
      if (shouldGenerateLocally) {
        logger.info('Before pipeline');
        try {
          await writeFileProm(fileName, snapshotReadableStream);
        } catch (error: CatchErr) {
          logger.error('Error occurred:', error);
          throw new Error(error);
        }
        logger.info('After pipeline');
      } else if (credBucketDetails.sendTo) {
        if (credBucketDetails.sendTo === 'aws') {
          data = await this.uploadToAWS(credBucketDetails, fileName, snapshotReadableStream);
        } else {
          throw new Error(
            `un-supported cloud provider, only these are supported currently(${supportedCloudProvidersForDumpStorage.join(
              ', ',
            )}) `,
          );
        }
      }
      // snapshotReadableStream.destroy();
      logger.info('Success', data);
      return {
        success: true,
        message: `Generated ${
          credBucketDetails.sendTo ? credBucketDetails.sendTo : 'locally'
        } with filename: ${fileName}`,
      };
    } catch (error: CatchErr) {
      logger.error(error);
      return {
        success: false,
        message: error.message,
      };
    } finally {
      // if (snapshotReadableStream) {
      //   snapshotReadableStream.destroy();
      // }
    }
  }
}

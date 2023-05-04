import { Context } from 'koa';
import MiscService from '../services/misc';
import ProfileService from '../services/profile';
import ControllerUtility from './util';

export default class ProfileController {
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
  public static async profile(ctx: Context) {
    const requestMetadata = MiscService.getRequestMetadata(ctx);
    const format = ctx.request.query.format as string;
    const { credBucketDetails } = ctx.request.body as any;
    const response = await ProfileService.profile(credBucketDetails, format);
    const status: number = response.success ? 200 : 400;
    ctx.body = response.message;
    ctx.status = status;
    ControllerUtility.postProcess(ctx, status);
    return ctx;
  }
}

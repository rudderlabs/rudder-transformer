/**
 * Manual E2E against a local MinIO (temporary file — not part of the suite).
 * Requires: docker run minio on :9000 with minioadmin/minioadmin.
 * Exercises the REAL pipeline: logger.requestLog/responseLog → sampler →
 * file staging → gzip → S3 PutObject → local cleanup.
 */
import fs from 'fs';
import os from 'os';
import path from 'path';
import zlib from 'zlib';

const ENDPOINT = 'http://localhost:9000';
const BUCKET = 'rudder-customer-sample-payload';
const DELIVERY_REQUEST_ID = 'e2e-delivery-1';

describe('payload capture E2E against MinIO', () => {
  test('captures request/response through the logger and uploads to the bucket', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'int6828-minio-e2e-'));
    process.env.REQ_RES_CAPTURE_ENABLED = 'true';
    process.env.REQ_RES_CAPTURE_S3_ENDPOINT = ENDPOINT;
    process.env.REQ_RES_CAPTURE_S3_BUCKET = BUCKET;
    process.env.REQ_RES_CAPTURE_DIR = dir;
    process.env.REQ_RES_CAPTURE_SAMPLE_INTERVAL_S = '1';
    process.env.AWS_ACCESS_KEY_ID = 'minioadmin';
    process.env.AWS_SECRET_ACCESS_KEY = 'minioadmin';
    process.env.AWS_REGION = 'us-east-1';
    // a configured AWS_PROFILE (e.g. expired SSO) wins over env keys in the SDK
    delete process.env.AWS_PROFILE;
    delete process.env.AWS_DEFAULT_PROFILE;
    process.env.LOG_DEST_IDS = 'destE2E';
    jest.resetModules();

    /* eslint-disable global-require, @typescript-eslint/no-var-requires */
    const sdk = require('@aws-sdk/client-s3');
    /* eslint-enable global-require, @typescript-eslint/no-var-requires */
    const client = new sdk.S3Client({
      endpoint: ENDPOINT,
      forcePathStyle: true,
      region: 'us-east-1',
    });
    try {
      await client.send(new sdk.CreateBucketCommand({ Bucket: BUCKET }));
    } catch {
      // bucket already exists from a previous run
    }

    /* eslint-disable global-require, @typescript-eslint/no-var-requires */
    const logger = require('../../logger');
    /* eslint-enable global-require, @typescript-eslint/no-var-requires */
    const metadata = [{ destinationId: 'destE2E', workspaceId: 'wsE2E', destType: 'E2E_DEST' }];

    logger.requestLog('E2E_DEST proxy request', {
      metadata,
      requestDetails: {
        url: 'https://api.example.com/track',
        body: { email: 'user@example.com', event: 'purchase' },
        method: 'POST',
      },
      requestId: DELIVERY_REQUEST_ID,
    });
    // the response is paired in by requestId — no sampling window needed
    logger.responseLog('E2E_DEST proxy response', {
      metadata,
      responseDetails: { body: { ok: true }, status: 200, headers: { 'x-req-id': 'e2e-1' } },
      requestId: DELIVERY_REQUEST_ID,
    });

    // records are staged locally in this worker's .open file
    const workerDir = path.join(dir, String(process.pid));
    expect(fs.readdirSync(workerDir).filter((f) => f.endsWith('.open'))).toHaveLength(1);

    /* eslint-disable global-require, @typescript-eslint/no-var-requires */
    const { payloadCapture } = require('./index');
    /* eslint-enable global-require, @typescript-eslint/no-var-requires */
    await payloadCapture.shutdown();

    // staged files are gone locally...
    expect(fs.readdirSync(workerDir)).toHaveLength(0);

    // ...and landed in MinIO under the per-customer prefix
    const listed = await client.send(
      new sdk.ListObjectsV2Command({ Bucket: BUCKET, Prefix: 'req-res-logs/wsE2E/destE2E/' }),
    );
    expect(listed.Contents?.length).toBeGreaterThanOrEqual(1);
    const key = listed.Contents?.[listed.Contents.length - 1]?.Key;
    if (!key) {
      throw new Error('no uploaded object found');
    }
    // eslint-disable-next-line no-console
    console.log('uploaded object key:', key);

    const obj = await client.send(new sdk.GetObjectCommand({ Bucket: BUCKET, Key: key }));
    const bytes = await obj.Body.transformToByteArray();
    const content = zlib.gunzipSync(bytes).toString();
    // eslint-disable-next-line no-console
    console.log('uploaded object content:\n', content);

    const lines = content
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line));
    expect(lines).toHaveLength(2);
    expect(lines[0]).toMatchObject({
      kind: 'request',
      requestId: DELIVERY_REQUEST_ID,
      workspaceId: 'wsE2E',
      destinationId: 'destE2E',
      url: 'https://api.example.com/track',
      method: 'POST',
    });
    expect(lines[1]).toMatchObject({
      kind: 'response',
      requestId: DELIVERY_REQUEST_ID,
      status: 200,
    });
  }, 30_000);
});

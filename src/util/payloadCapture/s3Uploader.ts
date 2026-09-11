import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { promisify } from 'util';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const gzipAsync = promisify(zlib.gzip);

export interface S3UploaderOptions {
  bucket: string;
  prefix: string;
  endpoint?: string;
  region?: string;
}

/**
 * Upload-only S3 interface (no list/download/delete of remote objects).
 * Credentials are intentionally not configured here: the SDK default chain
 * resolves pod-level identity (IRSA) in production and AWS_* env keys when
 * testing locally against MinIO.
 *
 * IO is fully async so a flush cycle never stalls the worker's event loop,
 * and the client carries explicit timeouts so a hung S3 cannot block
 * shutdown indefinitely.
 */
export class S3Uploader {
  private client: S3Client | undefined;

  constructor(private readonly opts: S3UploaderOptions) {}

  /** Uploads one rotated file and deletes it locally; returns its size in bytes. */
  async uploadFile(filePath: string): Promise<number> {
    const fileName = path.basename(filePath);
    const [workspaceId = 'unknown', destinationId = 'unknown'] = fileName.split('__');
    const date = new Date().toISOString().slice(0, 10);
    const key = `${this.opts.prefix}/${workspaceId}/${destinationId}/${date}/${fileName}.gz`;

    const contents = await fs.promises.readFile(filePath);
    const sizeBytes = contents.byteLength;
    // zero-copy view over the Buffer; satisfies zlib's typed signature
    const body = await gzipAsync(
      new Uint8Array(contents.buffer, contents.byteOffset, contents.byteLength),
    );
    await this.getClient().send(
      new PutObjectCommand({
        Bucket: this.opts.bucket,
        Key: key,
        Body: body,
        ContentType: 'application/x-ndjson',
        ContentEncoding: 'gzip',
      }),
    );
    await fs.promises.rm(filePath, { force: true });
    return sizeBytes;
  }

  private getClient(): S3Client {
    if (!this.client) {
      const bounds = {
        maxAttempts: 2,
        requestHandler: { connectionTimeout: 3000, requestTimeout: 10_000 },
      };
      // endpoint override is for local S3-compatible stores (MinIO), which
      // require path-style addressing; production uses the default chain
      this.client = this.opts.endpoint
        ? new S3Client({
            ...bounds,
            endpoint: this.opts.endpoint,
            forcePathStyle: true,
            region: this.opts.region || 'us-east-1',
          })
        : new S3Client(bounds);
    }
    return this.client;
  }
}

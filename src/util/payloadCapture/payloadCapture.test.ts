import fs from 'fs';
import os from 'os';
import path from 'path';
import zlib from 'zlib';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { AxiosHeaders } from 'axios';
import { mockClient } from 'aws-sdk-client-mock';
import { Sampler } from './sampler';
import { FileWriter } from './fileWriter';
import { S3Uploader } from './s3Uploader';

jest.mock('../stats', () => ({
  increment: jest.fn(),
}));

const s3Mock = mockClient(S3Client);

const tmpDirs: string[] = [];
const makeTmpDir = () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'payload-capture-test-'));
  tmpDirs.push(dir);
  return dir;
};
const workerDirOf = (dir: string) => path.join(dir, String(process.pid));

const gunzipBody = (body: unknown): string => {
  if (!(body instanceof Buffer) && !(body instanceof Uint8Array)) {
    throw new Error('expected uploaded Body to be a Buffer');
  }
  return zlib.gunzipSync(Uint8Array.from(body)).toString();
};

const writerOpts = (dir: string, overrides: Record<string, number> = {}) => ({
  dir,
  maxFileBytes: 1024 * 1024,
  maxDiskBytes: 10 * 1024 * 1024,
  instanceId: 'test-instance',
  ...overrides,
});

afterEach(() => {
  s3Mock.reset();
  jest.clearAllMocks();
  while (tmpDirs.length > 0) {
    fs.rmSync(tmpDirs.pop() as string, { recursive: true, force: true });
  }
});

describe('Sampler', () => {
  test('allows the first record and blocks within the interval', () => {
    const sampler = new Sampler(10_000);
    expect(sampler.allow('w1__d1', 1_000)).toBe(true);
    expect(sampler.allow('w1__d1', 5_000)).toBe(false);
    expect(sampler.allow('w1__d1', 11_000)).toBe(true);
  });

  test('tracks keys independently', () => {
    const sampler = new Sampler(10_000);
    expect(sampler.allow('w1__d1', 1_000)).toBe(true);
    expect(sampler.allow('w1__d2', 1_000)).toBe(true);
    expect(sampler.allow('w1__d1', 2_000)).toBe(false);
  });
});

describe('FileWriter', () => {
  test('writes into a per-pid subdirectory and exposes files after rotation', () => {
    const dir = makeTmpDir();
    const writer = new FileWriter(writerOpts(dir));
    writer.init();

    expect(writer.append('w1__d1', '{"a":1}\n')).toBe(true);
    expect(writer.listRotated()).toHaveLength(0);
    expect(fs.readdirSync(workerDirOf(dir)).filter((f) => f.endsWith('.open'))).toHaveLength(1);

    writer.rotateAll();
    const rotated = writer.listRotated();
    expect(rotated).toHaveLength(1);
    expect(path.dirname(rotated[0])).toBe(workerDirOf(dir));
    expect(fs.readFileSync(rotated[0], 'utf8')).toBe('{"a":1}\n');
    expect(path.basename(rotated[0]).startsWith('w1__d1__test-instance-')).toBe(true);
  });

  test('rotates a file once it crosses the size limit', () => {
    const dir = makeTmpDir();
    const writer = new FileWriter(writerOpts(dir, { maxFileBytes: 10 }));
    writer.init();
    writer.append('w1__d1', '{"a":1234567}\n');
    expect(writer.listRotated()).toHaveLength(1);
  });

  test('same-millisecond rotations never clobber a previously rotated file', () => {
    const dir = makeTmpDir();
    const writer = new FileWriter(writerOpts(dir, { maxFileBytes: 1 }));
    writer.init();
    writer.append('w1__d1', '{"a":1}\n'); // rotates immediately
    writer.append('w1__d1', '{"b":2}\n'); // same ms: must get a distinct filename
    expect(writer.listRotated()).toHaveLength(2);
  });

  test('drops records once the disk cap is reached', () => {
    const dir = makeTmpDir();
    const writer = new FileWriter(writerOpts(dir, { maxDiskBytes: 10 }));
    writer.init();
    expect(writer.hasCapacity()).toBe(true);
    expect(writer.append('w1__d1', '{"a":1}\n')).toBe(true);
    expect(writer.append('w1__d1', '{"b":2}\n')).toBe(false);
  });

  test('init makes own leftover .open files from a crashed run uploadable', () => {
    const dir = makeTmpDir();
    fs.mkdirSync(workerDirOf(dir), { recursive: true });
    fs.writeFileSync(path.join(workerDirOf(dir), 'w1__d1__stale-123.jsonl.open'), '{"a":1}\n');
    const writer = new FileWriter(writerOpts(dir));
    writer.init();
    expect(writer.listRotated().map((f) => path.basename(f))).toEqual(['w1__d1__stale-123.jsonl']);
  });

  test('init adopts files of dead pids but leaves live pids alone', () => {
    const dir = makeTmpDir();
    // "dead" worker: a pid that cannot exist on this host
    const deadDir = path.join(dir, '999999');
    fs.mkdirSync(deadDir, { recursive: true });
    fs.writeFileSync(path.join(deadDir, 'w1__d1__dead-1.jsonl.open'), '{"dead":1}\n');
    fs.writeFileSync(path.join(deadDir, 'w1__d2__dead-2.jsonl'), '{"dead":2}\n');
    // "live" worker: pid 1 is always alive
    const liveDir = path.join(dir, '1');
    fs.mkdirSync(liveDir, { recursive: true });
    fs.writeFileSync(path.join(liveDir, 'w1__d3__live-1.jsonl.open'), '{"live":1}\n');

    const writer = new FileWriter(writerOpts(dir));
    writer.init();

    const adopted = writer.listRotated().map((f) => path.basename(f));
    expect(adopted.sort()).toEqual(['w1__d1__dead-1.jsonl', 'w1__d2__dead-2.jsonl']);
    expect(fs.existsSync(deadDir)).toBe(false);
    expect(fs.readdirSync(liveDir)).toEqual(['w1__d3__live-1.jsonl.open']);
  });

  test('adoption tolerates a sibling worker adopting the same dead dir concurrently', () => {
    const dir = makeTmpDir();
    const deadDir = path.join(dir, '999999');
    fs.mkdirSync(deadDir, { recursive: true });
    fs.writeFileSync(path.join(deadDir, 'w1__d1__dead-1.jsonl'), '{"dead":1}\n');
    fs.writeFileSync(path.join(deadDir, 'w1__d2__dead-2.jsonl'), '{"dead":2}\n');
    // simulate the race: the first rename finds the file already moved away
    const spy = jest.spyOn(fs, 'renameSync').mockImplementationOnce(() => {
      throw Object.assign(new Error('ENOENT: no such file or directory'), { code: 'ENOENT' });
    });
    const writer = new FileWriter(writerOpts(dir));
    expect(() => writer.init()).not.toThrow();
    spy.mockRestore();
    expect(writer.listRotated().map((f) => path.basename(f))).toEqual(['w1__d2__dead-2.jsonl']);
    expect(fs.existsSync(deadDir)).toBe(false);
  });

  test('same-process double init hands existing open files to the newest writer', () => {
    const dir = makeTmpDir();
    const writerA = new FileWriter(writerOpts(dir));
    writerA.init();
    writerA.append('w1__d1', '{"a":1}\n');
    const writerB = new FileWriter(writerOpts(dir));
    // A's file is .open and owned by a live pid (ours) — B.init() renames it
    // only because it shares our pid dir; its content must survive intact
    writerB.init();
    writerA.rotateAll(); // A's rotate of an already-renamed file must not throw
    const contents = writerB
      .listRotated()
      .map((f) => fs.readFileSync(f, 'utf8'))
      .join('');
    expect(contents).toContain('{"a":1}');
  });
});

describe('S3Uploader', () => {
  test('uploads gzipped JSONL under the per-customer key and removes the local file', async () => {
    const dir = makeTmpDir();
    const filePath = path.join(dir, 'w1__d1__test-instance-123-456.jsonl');
    fs.writeFileSync(filePath, '{"a":1}\n');
    s3Mock.on(PutObjectCommand).resolves({});

    const uploader = new S3Uploader({ bucket: 'test-bucket', prefix: 'req-res-logs' });
    const sizeBytes = await uploader.uploadFile(filePath);

    expect(sizeBytes).toBe(8);
    expect(fs.existsSync(filePath)).toBe(false);
    expect(s3Mock.commandCalls(PutObjectCommand)).toHaveLength(1);
    const putArgs = s3Mock.commandCalls(PutObjectCommand)[0].args[0].input;
    expect(putArgs.Bucket).toBe('test-bucket');
    expect(putArgs.Key).toMatch(
      /^req-res-logs\/w1\/d1\/\d{4}-\d{2}-\d{2}\/w1__d1__test-instance-123-456\.jsonl\.gz$/,
    );
    expect(gunzipBody(putArgs.Body)).toBe('{"a":1}\n');
  });

  test('keeps the local file when the upload fails', async () => {
    const dir = makeTmpDir();
    const filePath = path.join(dir, 'w1__d1__test-instance-123-456.jsonl');
    fs.writeFileSync(filePath, '{"a":1}\n');
    s3Mock.on(PutObjectCommand).rejects(new Error('boom'));

    const uploader = new S3Uploader({ bucket: 'test-bucket', prefix: 'req-res-logs' });
    await expect(uploader.uploadFile(filePath)).rejects.toThrow('boom');
    expect(fs.existsSync(filePath)).toBe(true);
  });
});

describe('payloadCapture.write end to end (mocked S3)', () => {
  // config is read at module load, so each scenario re-requires the module
  // with its env; the S3 mock must be recreated against the freshly loaded
  // SDK class because jest.resetModules() gives it a new prototype
  const loadModule = (dir: string, enabled: boolean) => {
    process.env.REQ_RES_CAPTURE_ENABLED = String(enabled);
    process.env.REQ_RES_CAPTURE_DIR = dir;
    process.env.REQ_RES_CAPTURE_S3_BUCKET = 'test-bucket';
    process.env.REQ_RES_CAPTURE_SAMPLE_INTERVAL_S = '60';
    jest.resetModules();
    /* eslint-disable global-require, @typescript-eslint/no-var-requires */
    const sdk = require('@aws-sdk/client-s3');
    const freshS3Mock = mockClient(sdk.S3Client);
    const { payloadCapture } = require('./index');
    const freshStats = require('../stats');
    /* eslint-enable global-require, @typescript-eslint/no-var-requires */
    return { payloadCapture, freshS3Mock, freshPutObjectCommand: sdk.PutObjectCommand, freshStats };
  };

  const readStagedLines = (dir: string): Record<string, unknown>[] => {
    const workerDir = workerDirOf(dir);
    return fs.readdirSync(workerDir).flatMap((name) =>
      fs
        .readFileSync(path.join(workerDir, name), 'utf8')
        .trim()
        .split('\n')
        .map((line) => JSON.parse(line)),
    );
  };

  afterEach(() => {
    delete process.env.REQ_RES_CAPTURE_ENABLED;
    delete process.env.REQ_RES_CAPTURE_DIR;
    delete process.env.REQ_RES_CAPTURE_S3_BUCKET;
    delete process.env.REQ_RES_CAPTURE_SAMPLE_INTERVAL_S;
    delete process.env.REQ_RES_CAPTURE_SHUTDOWN_BUDGET_S;
  });

  test('write is a no-op when the feature is disabled', () => {
    const dir = makeTmpDir();
    const { payloadCapture } = loadModule(dir, false);
    payloadCapture.write({
      kind: 'request',
      identifierMsg: 'DT proxy request',
      metadata: [{ workspaceId: 'w1', destinationId: 'd1' }],
      details: { url: 'https://x', method: 'POST' },
    });
    expect(fs.readdirSync(dir)).toHaveLength(0);
  });

  test('an unwritable staging dir disables capture without breaking deliveries', () => {
    const { payloadCapture, freshStats } = loadModule('/dev/null/impossible', true);
    payloadCapture.write({
      kind: 'request',
      identifierMsg: 'DT proxy request',
      metadata: [{ workspaceId: 'w1', destinationId: 'd1' }],
      details: { url: 'https://x', method: 'POST' },
    });
    payloadCapture.write({
      kind: 'request',
      identifierMsg: 'DT proxy request',
      metadata: [{ workspaceId: 'w1', destinationId: 'd1' }],
      details: { url: 'https://x', method: 'POST' },
    });
    // one init-failure drop; later writes are silent no-ops, never sampled_out
    expect(freshStats.increment).toHaveBeenCalledTimes(1);
    expect(freshStats.increment).toHaveBeenCalledWith('payload_capture_dropped', {
      reason: 'init',
    });
  });

  test('a batched request with many same-pair metadatas writes exactly one record', () => {
    const dir = makeTmpDir();
    const { payloadCapture, freshStats } = loadModule(dir, true);
    payloadCapture.write({
      kind: 'request',
      identifierMsg: 'DT proxy request',
      metadata: [
        { workspaceId: 'w1', destinationId: 'd1', destType: 'DT' },
        { workspaceId: 'w1', destinationId: 'd1', destType: 'DT' },
        { workspaceId: 'w1', destinationId: 'd1', destType: 'DT' },
      ],
      details: { url: 'https://api.example.com', body: { a: 1 }, method: 'POST' },
    });
    expect(freshStats.increment).toHaveBeenCalledTimes(1);
    expect(freshStats.increment).toHaveBeenCalledWith('payload_capture_written');
  });

  test('oversized and non-plain bodies are truncated or marked, url and headers redacted', () => {
    const dir = makeTmpDir();
    const { payloadCapture } = loadModule(dir, true);
    class FakeFormData {
      streams = [1, 2, 3];
    }
    payloadCapture.write({
      kind: 'request',
      identifierMsg: 'DT proxy request',
      metadata: [{ workspaceId: 'w1', destinationId: 'd1' }],
      details: {
        url: 'https://api.example.com/track?apiKey=secret123&type=track&pwd=x&keyword=cars',
        body: new FakeFormData(),
        method: 'POST',
      },
      requestId: 'r-big',
    });
    payloadCapture.write({
      kind: 'response',
      identifierMsg: 'DT proxy response',
      metadata: [{ workspaceId: 'w1', destinationId: 'd1' }],
      details: {
        body: 'x'.repeat(300 * 1024),
        status: 200,
        // a real AxiosHeaders instance — production headers are never plain objects
        headers: new AxiosHeaders({
          'set-cookie': 'session=abc',
          'x-access-token': 'tok123',
          'content-type': 'application/json',
        }),
      },
      requestId: 'r-big',
    });

    const lines = readStagedLines(dir);
    expect(lines).toHaveLength(2);
    expect(lines[0]).toMatchObject({
      kind: 'request',
      // secret-looking keys masked, the rest stays debuggable
      url: 'https://api.example.com/track?apiKey=***&type=track&pwd=***&keyword=cars',
      body: { unserializable: 'FakeFormData' },
    });
    const responseBody = lines[1].body as Record<string, unknown>;
    expect(responseBody.truncated).toBe(true);
    expect((responseBody.preview as string).length).toBe(256 * 1024);
    expect(lines[1].headers).toEqual({
      'set-cookie': '***',
      'x-access-token': '***',
      'content-type': 'application/json',
    });
  });

  test('body cap is measured in UTF-8 bytes, not string length', () => {
    const dir = makeTmpDir();
    const { payloadCapture } = loadModule(dir, true);
    payloadCapture.write({
      kind: 'request',
      identifierMsg: 'DT proxy request',
      metadata: [{ workspaceId: 'w1', destinationId: 'd1' }],
      // 120k chars but ~360KB of UTF-8 — over the 256KB byte cap
      details: { body: '€'.repeat(120_000), method: 'POST' },
      requestId: 'r-utf8',
    });
    const [line] = readStagedLines(dir);
    const body = line.body as Record<string, unknown>;
    expect(body.truncated).toBe(true);
    expect(Buffer.byteLength(body.preview as string, 'utf8')).toBeLessThanOrEqual(256 * 1024);
    expect((body.preview as string).endsWith('�')).toBe(false);
  });

  test('a multi-pair batch only pairs the response for pairs whose request was captured', () => {
    const dir = makeTmpDir();
    const { payloadCapture } = loadModule(dir, true);
    // exhaust d2's sampling budget first
    payloadCapture.write({
      kind: 'request',
      identifierMsg: 'DT proxy request',
      metadata: [{ workspaceId: 'w1', destinationId: 'd2' }],
      details: { body: { seed: true }, method: 'POST' },
      requestId: 'r0',
    });
    // mixed batch: d1 wins its token, d2 is sampled out
    const mixed = [
      { workspaceId: 'w1', destinationId: 'd1' },
      { workspaceId: 'w1', destinationId: 'd2' },
    ];
    payloadCapture.write({
      kind: 'request',
      identifierMsg: 'DT proxy request',
      metadata: mixed,
      details: { body: { n: 1 }, method: 'POST' },
      requestId: 'r1',
    });
    payloadCapture.write({
      kind: 'response',
      identifierMsg: 'DT proxy response',
      metadata: mixed,
      details: { status: 200 },
      requestId: 'r1',
    });
    const lines = readStagedLines(dir);
    const byKind = (kind: string) => lines.filter((l) => l.kind === kind);
    expect(byKind('response')).toHaveLength(1);
    expect(byKind('response')[0]).toMatchObject({ destinationId: 'd1', requestId: 'r1' });
    // d2 got the seed request and was sampled out of the mixed one
    expect(
      byKind('request')
        .map((l) => l.destinationId)
        .sort(),
    ).toEqual(['d1', 'd2']);
  });

  test('sanitized IDs cannot collide and staging files are owner-only', () => {
    const dir = makeTmpDir();
    const { payloadCapture } = loadModule(dir, true);
    const write = (destinationId: string) =>
      payloadCapture.write({
        kind: 'request',
        identifierMsg: 'DT proxy request',
        metadata: [{ workspaceId: 'w1', destinationId }],
        details: { body: { d: destinationId }, method: 'POST' },
      });
    write('a/b');
    write('a-b'); // sanitizes to the same base — must stay a distinct pair
    const names = fs.readdirSync(workerDirOf(dir));
    expect(names).toHaveLength(2);
    expect(names.some((n) => /^w1__a-b-[0-9a-f]{8}__/.test(n))).toBe(true);
    expect(names.some((n) => n.startsWith('w1__a-b__'))).toBe(true);
    // eslint-disable-next-line no-bitwise
    expect(fs.statSync(workerDirOf(dir)).mode & 0o777).toBe(0o700);
    for (const name of names) {
      // eslint-disable-next-line no-bitwise
      expect(fs.statSync(path.join(workerDirOf(dir), name)).mode & 0o777).toBe(0o600);
    }
  });

  test('a failed upload keeps the file and labels the failure metric', async () => {
    const dir = makeTmpDir();
    const { payloadCapture, freshS3Mock, freshPutObjectCommand, freshStats } = loadModule(
      dir,
      true,
    );
    freshS3Mock.on(freshPutObjectCommand).rejects(new Error('bucket gone'));
    payloadCapture.write({
      kind: 'request',
      identifierMsg: 'DT proxy request',
      metadata: [{ workspaceId: 'w1', destinationId: 'd1' }],
      details: { body: { a: 1 }, method: 'POST' },
      requestId: 'r1',
    });
    await payloadCapture.shutdown();
    expect(freshStats.increment).toHaveBeenCalledWith('payload_capture_upload_failure', {
      reason: 'Error',
    });
    expect(fs.readdirSync(workerDirOf(dir)).filter((f) => f.endsWith('.jsonl'))).toHaveLength(1);
  });

  test('captures a request, pairs its response, samples out the next delivery', async () => {
    const dir = makeTmpDir();
    const { payloadCapture, freshS3Mock, freshPutObjectCommand, freshStats } = loadModule(
      dir,
      true,
    );
    freshS3Mock.on(freshPutObjectCommand).resolves({});
    const metadata = [{ workspaceId: 'w1', destinationId: 'd1', destType: 'DT' }];

    // first delivery: request wins the sampling token, response is paired in
    payloadCapture.write({
      kind: 'request',
      identifierMsg: 'DT proxy request',
      metadata,
      details: { url: 'https://api.example.com', body: { a: 1 }, method: 'POST' },
      requestId: 'r1',
    });
    payloadCapture.write({
      kind: 'response',
      identifierMsg: 'DT proxy response',
      metadata,
      details: { body: { ok: true }, status: 200 },
      requestId: 'r1',
    });
    // second delivery in the same window: request sampled out, response skipped
    payloadCapture.write({
      kind: 'request',
      identifierMsg: 'DT proxy request',
      metadata,
      details: { url: 'https://api.example.com', body: { a: 2 }, method: 'POST' },
      requestId: 'r2',
    });
    payloadCapture.write({
      kind: 'response',
      identifierMsg: 'DT proxy response',
      metadata,
      details: { body: { throttled: true }, status: 429 },
      requestId: 'r2',
    });
    expect(freshStats.increment).toHaveBeenCalledTimes(3);
    expect(freshStats.increment).toHaveBeenCalledWith('payload_capture_written');
    expect(freshStats.increment).toHaveBeenCalledWith('payload_capture_sampled_out');

    await payloadCapture.shutdown();

    expect(freshS3Mock.commandCalls(freshPutObjectCommand)).toHaveLength(1);
    const putArgs = freshS3Mock.commandCalls(freshPutObjectCommand)[0].args[0].input;
    expect(putArgs.Key).toMatch(/^req-res-logs\/w1\/d1\//);
    const lines = gunzipBody(putArgs.Body)
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line));
    expect(lines).toHaveLength(2);
    expect(lines[0]).toMatchObject({
      kind: 'request',
      requestId: 'r1',
      workspaceId: 'w1',
      destinationId: 'd1',
      destType: 'DT',
      url: 'https://api.example.com',
      body: { a: 1 },
      method: 'POST',
    });
    expect(lines[1]).toMatchObject({
      kind: 'response',
      requestId: 'r1',
      status: 200,
      body: { ok: true },
    });
    expect(fs.readdirSync(workerDirOf(dir))).toHaveLength(0);
  });

  test('interleaved responses across deliveries pair correctly regardless of order', () => {
    const dir = makeTmpDir();
    const { payloadCapture, freshStats } = loadModule(dir, true);
    const metadata = [{ workspaceId: 'w1', destinationId: 'd1', destType: 'DT' }];
    const write = (kind: 'request' | 'response', requestId: string, details: object) =>
      payloadCapture.write({
        kind,
        identifierMsg: `DT proxy ${kind}`,
        metadata,
        details,
        requestId,
      });

    // concurrent deliveries: r1 and r2 both start, responses arrive reversed
    write('request', 'r1', { url: 'https://api.example.com', body: { n: 1 }, method: 'POST' });
    write('request', 'r2', { url: 'https://api.example.com', body: { n: 2 }, method: 'POST' }); // sampled out
    write('response', 'r2', { status: 200 }); // skipped: its request was not captured
    write('response', 'r1', { status: 500 }); // captured: pairs with r1 despite arriving last

    const lines = readStagedLines(dir);
    expect(lines).toHaveLength(2);
    expect(lines[0]).toMatchObject({ kind: 'request', requestId: 'r1', body: { n: 1 } });
    expect(lines[1]).toMatchObject({ kind: 'response', requestId: 'r1', status: 500 });
    expect(freshStats.increment).toHaveBeenCalledTimes(3); // 2 written + 1 sampled_out
  });

  test('a response with an unknown requestId is skipped silently', () => {
    const dir = makeTmpDir();
    const { payloadCapture, freshStats } = loadModule(dir, true);
    payloadCapture.write({
      kind: 'response',
      identifierMsg: 'DT proxy response',
      metadata: [{ workspaceId: 'w1', destinationId: 'd1' }],
      details: { status: 200 },
      requestId: 'never-captured',
    });
    expect(freshStats.increment).not.toHaveBeenCalled();
    expect(fs.readdirSync(workerDirOf(dir))).toHaveLength(0);
  });

  test('an id-less response falls back to its own sampling budget', () => {
    const dir = makeTmpDir();
    const { payloadCapture, freshStats } = loadModule(dir, true);
    const write = () =>
      payloadCapture.write({
        kind: 'response',
        identifierMsg: 'DT proxy response',
        metadata: [{ workspaceId: 'w1', destinationId: 'd1' }],
        details: { status: 200 },
      });
    write();
    write(); // same window: denied, but not counted as sampled_out
    expect(freshStats.increment).toHaveBeenCalledTimes(1);
    expect(freshStats.increment).toHaveBeenCalledWith('payload_capture_written');
  });

  test('concurrent shutdowns share one in-flight flush and upload once', async () => {
    const dir = makeTmpDir();
    const { payloadCapture, freshS3Mock, freshPutObjectCommand } = loadModule(dir, true);
    freshS3Mock.on(freshPutObjectCommand).callsFake(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve({}), 100);
        }),
    );
    payloadCapture.write({
      kind: 'request',
      identifierMsg: 'DT proxy request',
      metadata: [{ workspaceId: 'w1', destinationId: 'd1' }],
      details: { url: 'https://api.example.com', body: { a: 1 }, method: 'POST' },
      requestId: 'r1',
    });
    await Promise.all([payloadCapture.shutdown(), payloadCapture.shutdown()]);
    expect(freshS3Mock.commandCalls(freshPutObjectCommand)).toHaveLength(1);
    expect(fs.readdirSync(workerDirOf(dir))).toHaveLength(0);
  });

  test('shutdown resolves within its budget when S3 hangs, keeping the staged file', async () => {
    const dir = makeTmpDir();
    process.env.REQ_RES_CAPTURE_SHUTDOWN_BUDGET_S = '1';
    const { payloadCapture, freshS3Mock, freshPutObjectCommand } = loadModule(dir, true);
    freshS3Mock.on(freshPutObjectCommand).callsFake(
      () =>
        new Promise(() => {
          // never resolves — simulates a hung S3
        }),
    );
    payloadCapture.write({
      kind: 'request',
      identifierMsg: 'DT proxy request',
      metadata: [{ workspaceId: 'w1', destinationId: 'd1' }],
      details: { url: 'https://api.example.com', body: { a: 1 }, method: 'POST' },
      requestId: 'r1',
    });
    const startedAt = Date.now();
    await payloadCapture.shutdown();
    expect(Date.now() - startedAt).toBeLessThan(1_500);
    // the rotated file survives locally for adoption by the next start
    expect(fs.readdirSync(workerDirOf(dir)).filter((f) => f.endsWith('.jsonl'))).toHaveLength(1);
  });
});

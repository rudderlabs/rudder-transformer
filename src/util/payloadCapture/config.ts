import { CaptureConfig } from './types';

const toPositiveInt = (value: string | undefined, fallback: number): number => {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isNaN(parsed) || parsed <= 0 ? fallback : parsed;
};

export const getCaptureConfig = (): CaptureConfig => ({
  enabled: process.env.REQ_RES_CAPTURE_ENABLED === 'true',
  bucket: process.env.REQ_RES_CAPTURE_S3_BUCKET || 'rudder-customer-sample-payload',
  prefix: process.env.REQ_RES_CAPTURE_S3_PREFIX || 'req-res-logs',
  // set only for local testing against MinIO or another S3-compatible store
  endpoint: process.env.REQ_RES_CAPTURE_S3_ENDPOINT,
  region: process.env.AWS_REGION,
  dir: process.env.REQ_RES_CAPTURE_DIR || '/tmp/rudder-transformer-capture',
  sampleIntervalMs: toPositiveInt(process.env.REQ_RES_CAPTURE_SAMPLE_INTERVAL_S, 10) * 1000,
  flushIntervalMs: toPositiveInt(process.env.REQ_RES_CAPTURE_FLUSH_INTERVAL_S, 600) * 1000,
  maxFileBytes: toPositiveInt(process.env.REQ_RES_CAPTURE_MAX_FILE_MB, 10) * 1024 * 1024,
  maxDiskBytes: toPositiveInt(process.env.REQ_RES_CAPTURE_MAX_DISK_MB, 200) * 1024 * 1024,
  // small default: this budget runs inside the cluster manager's 30s total,
  // after the up-to-30s http drain — see the ops note in the design doc
  shutdownBudgetMs: toPositiveInt(process.env.REQ_RES_CAPTURE_SHUTDOWN_BUDGET_S, 5) * 1000,
});

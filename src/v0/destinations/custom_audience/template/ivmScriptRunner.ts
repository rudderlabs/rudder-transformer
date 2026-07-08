import { IvmScriptRunner, resolveBundlePath } from '../../../../util/ivm/scriptRunner';

export { IvmScriptRunner } from '../../../../util/ivm/scriptRunner';

// ---------------------------------------------------------------------------
// Shared runner for custom_audience template operations.
//
// One isolate per workspaceId serves both parsing and execution. Memory and
// timeout are sized for the heavier op (evaluate); the lighter parse op runs
// comfortably inside the same envelope.
// ---------------------------------------------------------------------------

// src/…/template — 5 levels up reaches the build root (dist/ in production).
export const BUNDLE_PATH = resolveBundlePath(
  __dirname,
  '../../../../../',
  'templateEngineSandbox.bundle.js',
);

export const templateSandboxRunner = new IvmScriptRunner({
  bundlePath: BUNDLE_PATH,
  memoryLimitMb: Number.parseInt(process.env.CUSTOM_AUDIENCE_IVM_MEMORY_MB || '32', 10),
  initTimeoutMs: Number.parseInt(process.env.CUSTOM_AUDIENCE_IVM_INIT_TIMEOUT_MS || '5000', 10),
  execTimeoutMs: Number.parseInt(process.env.CUSTOM_AUDIENCE_IVM_EXEC_TIMEOUT_MS || '500', 10),
  cacheName: 'custom_audience_ivm',
});

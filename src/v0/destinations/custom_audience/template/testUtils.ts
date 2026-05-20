import fs from 'fs';
import path from 'path';

const BUNDLE_PATH = path.resolve(__dirname, '../../../../../dist/templateEngineSandbox.bundle.js');
const ENTRY_SOURCE = path.resolve(__dirname, 'templateEngineSandbox.ts');
const PARSER_SOURCE = path.resolve(__dirname, 'templateEngine.ts');

export function assertBundleFreshness() {
  if (!fs.existsSync(BUNDLE_PATH)) {
    throw new Error(
      `Bundle not found at ${BUNDLE_PATH}. Run \`npm run build:custom-audience-sandbox\` first.`,
    );
  }
  const bundleMtime = fs.statSync(BUNDLE_PATH).mtimeMs;
  for (const src of [ENTRY_SOURCE, PARSER_SOURCE]) {
    if (fs.existsSync(src) && fs.statSync(src).mtimeMs > bundleMtime) {
      throw new Error(
        `${path.basename(src)} is newer than the bundle. Run \`npm run build:custom-audience-sandbox\` to rebuild.`,
      );
    }
  }
}

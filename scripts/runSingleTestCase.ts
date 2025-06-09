/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
import {
  parseArgs,
  extractField,
  getDestination,
  resolveDataFile,
  importDataModule,
  runTestCommand,
} from './common';

async function main() {
  const { filePath, dataString } = parseArgs();

  let testcaseIndex = 0;
  const description = extractField(dataString, 'description') || '';
  const feature = extractField(dataString, 'feature') || '';
  const destination = getDestination(filePath);

  const dataFile = await resolveDataFile(filePath);
  console.log(`Using data file: ${dataFile}`);
  const data = await importDataModule(dataFile);

  const testCase = data.find((tc, i) => {
    testcaseIndex = i;
    return tc.description === description && tc.feature === feature;
  });

  if (!testCase?.input?.request) {
    console.error('Matching test case not found or invalid structure.');
    process.exit(1);
  }

  const command = `npm run test:ts -- component --destination=${destination} --feature=${feature} --index=${testcaseIndex}`;
  runTestCommand(command);
}

main();

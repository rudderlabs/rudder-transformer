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

  const description = extractField(dataString, 'description') || '';
  const feature = extractField(dataString, 'feature') || '';
  const destination = getDestination(filePath);

  const dataFile = await resolveDataFile(filePath);
  console.log(`Using data file: ${dataFile}`);
  const data = await importDataModule(dataFile);

  const testCaseIndex = data.findIndex(
    (tc) => tc.description === description && tc.feature === feature,
  );

  if (testCaseIndex === -1) {
    console.error('Matching test case not found or invalid structure.');
    process.exit(1);
  }

  const command = `npm run test:ts -- component --destination=${destination} --feature=${feature} --index=${testCaseIndex}`;
  runTestCommand(command);
}

main();

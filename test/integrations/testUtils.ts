import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import { TestCaseData } from './testTypes';

export const getTestDataFilePaths = (dirPath): string[] => {
  const dirEntries = readdirSync(dirPath);
  const testDataFilePaths: string[] = [];
  dirEntries.forEach((dEntry) => {
    const dEntryPath = join(dirPath, dEntry);
    const stats = statSync(dEntryPath);
    if (stats.isFile() && dEntry.toLowerCase() === 'data.ts') {
      testDataFilePaths.push(dEntryPath);
    } else if (stats.isDirectory()) {
      testDataFilePaths.push(...getTestDataFilePaths(dEntryPath));
    }
  });
  return testDataFilePaths;
};

export const getTestData = (filePath): TestCaseData[] => {
  return require(filePath).data as TestCaseData[];
};

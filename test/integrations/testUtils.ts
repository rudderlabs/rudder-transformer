import { globSync } from 'glob';
import { join } from 'path';
import { TestCaseData } from './testTypes';

export const getTestDataFilePaths = (dirPath: string, destination: string = ''): string[] => {
  const globPattern = join(dirPath, '**', 'data.ts');
  let testFilePaths = globSync(globPattern);
  if (destination) {
    testFilePaths = testFilePaths.filter((testFile) => testFile.includes(destination));
  }
  return testFilePaths;
};

export const getTestData = (filePath): TestCaseData[] => {
  return require(filePath).data as TestCaseData[];
};

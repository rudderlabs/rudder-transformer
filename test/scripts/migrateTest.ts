import fs from 'fs';
import path from 'path';

import prettier from 'prettier';
import { Command } from 'commander';

// Initialize command line options
const program = new Command();
program
  .option('-d, --destination <string>', 'Destination name to migrate')
  .option('-f, --feature <type>', 'Feature type (processor/router/proxy)', 'processor')
  // .option('-p, --path <string>', 'Base path for test files', path.join(__dirname, 'destinations'))
  .parse(process.argv);

const options = program.opts();

// Default values and utility functions from the previous example
import {
  migrateProcessorTestCase,
  migrateRouterTestCase,
  migrateProxyTestCase,
  extractCommonValues,
  generateOptimizedTestFile,
} from './migrationUtils';
import { getTestData, getTestDataFilePaths } from '../integrations/testUtils';

function readTestFile(filePath: string): any {
  try {
    const fileContent = getTestData(filePath);
    return fileContent;
  } catch (error) {
    console.error(`Error reading test file ${filePath}:`, error);
    return null;
  }
}

async function formatWithPrettier(content: string, filepath: string): Promise<string> {
  try {
    // Try to load prettier config from the project
    const prettierConfig = await prettier.resolveConfig(filepath);

    // Format the content using prettier with either found config or defaults
    const formattedContent = await prettier.format(content, {
      ...prettierConfig,
      filepath, // This helps prettier determine parser based on file extension
      parser: 'typescript', // Fallback to typescript parser if not determined from filepath
    });

    return formattedContent;
  } catch (error) {
    console.error('Error formatting file with prettier:', error);
    // Return original content if formatting fails
    return content;
  }
}

async function enhancedwriteTestFile(
  filePath: string,
  testCases: any[],
  feature: string,
): Promise<void> {
  try {
    // Extract common values
    const commonValues = extractCommonValues(testCases);

    // Generate optimized content
    const content = generateOptimizedTestFile(testCases, commonValues, feature);

    // Format with prettier
    const formattedContent = await formatWithPrettier(content, filePath);

    // Write the formatted content
    fs.writeFileSync(filePath, formattedContent);
  } catch (error) {
    console.error(`Error writing to file ${filePath}:`, error);
    throw error;
  }
}

async function migrateTestFiles(): Promise<void> {
  const { destination, feature } = options;

  if (!destination) {
    console.error('Please specify a destination with -d or --destination');
    process.exit(1);
  }

  console.log(`Starting migration for destination: ${destination}, feature: ${feature}`);

  const basePath = path.resolve(__dirname, '..');

  const testFiles = getTestDataFilePaths(basePath, options);

  if (testFiles.length === 0) {
    console.log('No test files found matching the criteria');
    return;
  }

  let migratedCount = 0;
  let errorCount = 0;

  for (const filePath of testFiles) {
    console.log(`\nProcessing file: ${filePath}`);
    try {
      const testCases = readTestFile(filePath);
      if (!testCases) continue;

      const migratedTests = testCases.map((testCase: any, index: number) => {
        try {
          switch (feature.toLowerCase()) {
            case 'processor':
              return migrateProcessorTestCase(testCase, index);
            case 'router':
              return migrateRouterTestCase(testCase, index);
            case 'proxy':
              return migrateProxyTestCase(testCase, index);
            default:
              throw new Error(`Unsupported feature type: ${feature}`);
          }
        } catch (error) {
          console.error(`Error migrating test case: ${testCase.name || 'unnamed'}`, error);
          return testCase;
        }
      });

      // Create backup of original file
      const backupPath = filePath.replace('data.ts', 'data.backup.ts');
      fs.copyFileSync(filePath, backupPath);
      console.log(`Created backup at: ${backupPath}`);

      // Write migrated tests
      await enhancedwriteTestFile(filePath, migratedTests, feature.toLowerCase());
      console.log(`Successfully migrated ${migratedTests.length} test cases in ${filePath}`);
      migratedCount += migratedTests.length;
    } catch (error) {
      console.error(`Error processing file ${filePath}:`, error);
      errorCount++;
    }
  }

  console.log('\nMigration Summary:');
  console.log(`Total files processed: ${testFiles.length}`);
  console.log(`Total test cases migrated: ${migratedCount}`);
  console.log(`Files with errors: ${errorCount}`);
}

// Run migration if this script is called directly
if (require.main === module) {
  migrateTestFiles().catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
}

export { migrateTestFiles };

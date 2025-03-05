#!/usr/bin/env node

import fs from 'fs';
import { globSync } from 'glob';
import path from 'path';

/**
 * Process a given file:
 * 1. Add the "import * as path from 'path';" line at the top if it doesn't exist.
 * 2. Replace lines matching "export const secret<number> = generateRandomString();" with the modified version.
 */
function updateFileContent(content: string, filePath: string) {
  let updatedContent = `import path from 'path';\n` + content;

  // Regex that matches:
  //    export const secretX = generateRandomString();
  // where X is one or more digits.
  const secretRegex = /export\s+const\s+(secret(\d+))\s*=\s*generateRandomString\(\);/g;

  // Replace each occurrence with the desired string:
  //   export const secretX = path.basename(__dirname) + X;
  updatedContent = updatedContent.replace(secretRegex, (match, secretName, secretNumber) => {
    return `export const ${secretName} = path.basename(__dirname) + ${secretNumber};`;
  });

  return updatedContent;
}

// Find all maskedSecrets.ts files matching the pattern.
const maskedSecretsFiles = globSync(
  path.join(__dirname, '..', 'integrations', 'destinations', '**', 'maskedSecrets.ts'),
);

maskedSecretsFiles.forEach((filePath) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', filePath, err);
      return;
    }
    const updatedContent = updateFileContent(data, filePath);
    fs.writeFile(filePath, updatedContent, 'utf8', (err) => {
      if (err) {
        console.error('Error writing file:', filePath, err);
      } else {
        console.log('File updated successfully:', filePath);
      }
    });
  });
});

#!/usr/bin/env ts-node

import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';

const updateFileContent = (fileContent: string, filePath: string) => {
  // Split the file into lines.
  const lines: string[] = fileContent.split('\n');

  // Arrays to hold different types of lines.
  const importLines: string[] = [];
  const secretLines: string[] = [];
  const authHeaderLines: string[] = [];
  const otherLines: string[] = [];

  // Regular expressions to identify secret and authHeader export lines.
  const secretRegex: RegExp = /^export\s+const\s+(secret\d+)\s*=/;
  const authHeaderRegex: RegExp = /^export\s+const\s+(authHeader\d+)\s*=/;

  // Process each line and group accordingly.
  for (const line of lines) {
    if (line.startsWith('import')) {
      importLines.push(line);
    } else if (secretRegex.test(line)) {
      secretLines.push(line);
    } else if (authHeaderRegex.test(line)) {
      authHeaderLines.push(line);
    } else {
      otherLines.push(line);
    }
  }

  // Sort secretLines numerically based on their index.
  secretLines.sort((a, b) => {
    const matchA = a.match(/secret(\d+)/);
    const matchB = b.match(/secret(\d+)/);
    if (matchA && matchB) {
      const numA = parseInt(matchA[1], 10);
      const numB = parseInt(matchB[1], 10);
      return numA - numB;
    }
    return 0;
  });

  // Sort authHeaderLines numerically based on their index.
  authHeaderLines.sort((a, b) => {
    const matchA = a.match(/authHeader(\d+)/);
    const matchB = b.match(/authHeader(\d+)/);
    if (matchA && matchB) {
      const numA = parseInt(matchA[1], 10);
      const numB = parseInt(matchB[1], 10);
      return numA - numB;
    }
    return 0;
  });

  // Reconstruct the file content.
  // Order: import lines first, then any other lines (e.g., comments),
  // followed by all secret definitions and finally the authHeader definitions.
  const reorderedContent: string = [
    ...importLines,
    ...otherLines.filter((line) => line.trim() !== ''),
    ...secretLines,
    ...authHeaderLines,
  ].join('\n');

  // Write the updated content back to the file.
  return reorderedContent;
};

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

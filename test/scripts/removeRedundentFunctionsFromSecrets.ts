#!/usr/bin/env node
/**
 * This script will:
 * 1. Find all .js and .ts files (except in node_modules).
 * 2. For any file with “maskedSecrets” in its path, update the export declarations:
 *    - Convert “export const getAuthHeader_N = () => …;” to “export const authHeaderN = …;”
 *    - Convert “export const getSecret_N = () => …;” to “export const secretN = …;”
 *    (Also update inner calls from getSecret_N() to secretN.)
 * 3. For all files, update import statements and function usages.
 */

import fs from 'fs';
import { globSync } from 'glob';
import path from 'path';

const updateFileContent = (content: string, filePath: string) => {
  let newContent = content;

  // --- 1. Update export declarations in maskedSecrets files ---
  if (filePath.includes('maskedSecrets')) {
    // Replace getAuthHeader declarations
    newContent = newContent.replace(
      /export\s+const\s+getAuthHeader_(\d+)\s*=\s*\(\)\s*=>\s*(.+);/g,
      (match, num, body) => {
        // Update inner reference from getSecret_N() to secretN
        const modifiedBody = body.replace(/getSecret_(\d+)\(\)/g, 'secret$1');
        // Remove the "get" part and also remove the underscore before the number
        return `export const authHeader${num} = ${modifiedBody};`;
      },
    );

    // Replace getSecret declarations
    newContent = newContent.replace(
      /export\s+const\s+getSecret_(\d+)\s*=\s*\(\)\s*=>\s*(.+);/g,
      (match, num, body) => {
        return `export const secret${num} = ${body};`;
      },
    );
  }

  // --- 2. Update import statements and usage in all files ---
  // Replace function call usages: e.g. getAuthHeader_1() -> authHeader1 and getSecret_1() -> secret1
  newContent = newContent
    .replace(/getAuthHeader_(\d+)\s*\(\)/g, 'authHeader$1')
    .replace(/getSecret_(\d+)\s*\(\)/g, 'secret$1')
    // Also update any identifier (such as in import lists) so that the "get" prefix is removed.
    .replace(/\bgetAuthHeader_(\d+)\b/g, 'authHeader$1')
    .replace(/\bgetSecret_(\d+)\b/g, 'secret$1');

  return newContent;
};

// Find all maskedSecrets.ts files matching the pattern.
const maskedSecretsFiles = globSync(
  path.join(__dirname, '..', 'integrations', 'destinations', '**', '*.ts'),
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

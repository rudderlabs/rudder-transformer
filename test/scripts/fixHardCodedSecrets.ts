import fs from 'fs';
import path from 'path';
import { sync as globSync } from 'glob';

function isValidBase64(str) {
  // Regular expression to check for valid Base64 characters
  const base64Pattern = /^[A-Za-z0-9+/=]+$/;

  // Check if the string matches the Base64 pattern and length is a multiple of 4
  if (base64Pattern.test(str) && str.length % 4 === 0) {
    try {
      // Decode using Node.js Buffer
      const buffer = Buffer.from(str, 'base64');

      // Convert buffer to string after decoding
      const decodedStr = buffer.toString('utf-8');

      // Check for non-printable characters (ASCII 32-126 are printable)
      for (let i = 0; i < decodedStr.length; i++) {
        const charCode = decodedStr.charCodeAt(i);
        // Check if the character is outside the printable ASCII range
        if (charCode < 32 || charCode > 126) {
          return false; // Found a non-printable character
        }
      }

      // Check if encoding back to Base64 matches the original string
      return buffer.toString('base64') === str;
    } catch (e) {
      return false; // If there's an error during decoding
    }
  }

  return false; // If the string doesn't match the Base64 pattern or length isn't a multiple of 4
}

/**
 * Updates or adds the import statement from '@rudderstack/integrations-lib'
 * to ensure that generateRandomString is imported.
 */
function updateImportStatement(fileContent: string): string {
  const importRegex = /import\s+{([^}]+)}\s+from\s+['"]@rudderstack\/integrations-lib['"];/;
  const match = fileContent.match(importRegex);

  if (match) {
    // Extract and clean up the list of currently imported modules.
    const importedModules = match[1]
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (!importedModules.includes('generateRandomString')) {
      importedModules.push('generateRandomString');
      const newImport = `import { ${importedModules.join(', ')} } from '@rudderstack/integrations-lib';`;
      fileContent = fileContent.replace(importRegex, newImport);
    }
  } else {
    // No existing import from '@rudderstack/integrations-lib'.
    // Insert a new import at the top of the file.
    const importStatement = `\n`;
    const lines = fileContent.split('\n');

    // Preserve a possible shebang line.
    if (lines[0].startsWith('#!')) {
      fileContent = lines[0] + '\n' + importStatement + lines.slice(1).join('\n');
    } else {
      fileContent = importStatement + fileContent;
    }
  }
  return fileContent;
}

/**
 * Updates each getSecret_N function that returns a hard-coded string,
 * replacing that string with a call to generateRandomString(16).
 */
function updateGetSecretFunctions(fileContent: string): string {
  const secretRegex = /(export\s+const\s+getSecret_\d+\s*=\s*\(\)\s*=>\s*)'[^']*';/g;
  return fileContent.replace(secretRegex, `$1generateRandomString();`);
}

/**
 * Processes an individual file: reads the content, makes the replacements,
 * and writes the updated content back (if changes are detected).
 */
function updateFileContent(originalContent: string, filePath: string): string {
  console.log(`Processing ${filePath}`);

  let updatedContent = originalContent;
  updatedContent = updateImportStatement(updatedContent);
  updatedContent = updateGetSecretFunctions(updatedContent);

  return updatedContent;
}

// Find all maskedSecrets.ts files matching the pattern.
const maskedSecretsFiles = globSync(
  path.join(__dirname, '..', 'integrations', 'destinations', '*', 'maskedSecrets.ts'),
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

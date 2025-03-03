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
 * Updates a file's content:
 * - Builds a mapping from secret literal values (returned by getSecret_x functions) to their function names.
 * - If the file contains any Basic auth header, ensures an import for { base64Convertor } from '@rudderstack/integrations-lib' is added.
 * - Processes each auth header:
 *   - For a 'Basic' header, it decodes the base64 string.
 *     • If decoding fails, it falls back to using the default secret function.
 *     • If decoding succeeds and includes a colon, it splits into username and candidate secret.
 *       Then it checks for matching getSecret functions for both parts:
 *         - If a matching username is found, the username is replaced by its function call; otherwise, the username is used as a literal.
 *         - Similarly for the candidate secret.
 *       Finally, the header is rebuilt by dynamically constructing the string "username:secret" and passing it to base64Convertor.
 *   - For Bearer/Token headers, a dynamic template referencing the default secret function is used.
 */
function updateFileContent(fileContent: string, filePath: string) {
  // Build a mapping: literal value -> getSecret function name.
  const secretMapping: Record<string, string> = {};
  const secretRegex = /export const (getSecret_\d+) = \(\) =>\s*'([^']+)'/g;
  let secretMatch;
  while ((secretMatch = secretRegex.exec(fileContent)) !== null) {
    const secretFunc = secretMatch[1]; // e.g., getSecret_1
    const secretValue = secretMatch[2]; // e.g., "test-site-id" or "test-api-key"
    secretMapping[secretValue] = secretFunc;
  }

  // If any Basic auth header exists, insert the import statement for base64Convertor.
  const basicAuthRegex = /export const getAuthHeader_\d+ = \(\) =>\s*'Basic /;
  if (basicAuthRegex.test(fileContent)) {
    const importStatement = "import { base64Convertor } from '@rudderstack/integrations-lib';";
    if (!fileContent.includes(importStatement)) {
      fileContent = `${importStatement}\n\n${fileContent}`;
    }
  }

  // Process the auth header definitions.
  const authHeaderRegex = /export const (getAuthHeader_(\d+)) = \(\) =>\s*'([^']+)'/g;
  return fileContent.replace(authHeaderRegex, (match, funcName, num, headerValue) => {
    let newHeaderTemplate: string;
    // Fallback secret function (default for this auth header) is based on the header number.
    const defaultSecretFuncName = `getSecret_${num}`;

    if (headerValue.startsWith('Basic ')) {
      const encodedPart = headerValue.substring(6).trim();
      let decoded = isValidBase64(encodedPart)
        ? Buffer.from(encodedPart, 'base64').toString('utf8')
        : '';

      if (!decoded) {
        const secretReplacement = secretMapping[encodedPart] || defaultSecretFuncName;
        // Decoding failed: fall back to plain token using default secret.
        newHeaderTemplate = `\`Basic \${${secretReplacement}()}\``;
      } else if (decoded.indexOf(':') !== -1) {
        // Decoded value is in "username:secret" format.
        const colonIndex = decoded.indexOf(':');
        const usernamePart = decoded.substring(0, colonIndex);
        const candidateSecret = decoded.substring(colonIndex + 1);

        // Try to match the username and candidate secret from the mapping.
        const usernameReplacement = secretMapping[usernamePart]
          ? `${secretMapping[usernamePart]}()`
          : JSON.stringify(usernamePart);
        const secretReplacement = secretMapping[candidateSecret]
          ? `${secretMapping[candidateSecret]}()`
          : JSON.stringify(candidateSecret);

        // Build the new header dynamically.
        newHeaderTemplate = `\`Basic \${base64Convertor(${usernameReplacement} + ":" + ${secretReplacement})}\``;
      } else {
        // Decoded but there's no colon: fall back to using the default secret function (no base64 conversion of a composite value).
        newHeaderTemplate = `\`Basic \${base64Convertor(${defaultSecretFuncName}())}\``;
      }
    } else if (headerValue.startsWith('Bearer ')) {
      newHeaderTemplate = `\`Bearer \${${defaultSecretFuncName}()}\``;
    } else if (headerValue.startsWith('Token ')) {
      newHeaderTemplate = `\`Token \${${defaultSecretFuncName}()}\``;
    } else {
      return match;
    }

    return `export const ${funcName} = () => ${newHeaderTemplate}`;
  });
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

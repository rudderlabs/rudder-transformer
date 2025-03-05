import * as fs from 'fs';
import * as path from 'path';

// Constants for configuration
const EXCLUDED_FOLDERS = ['ga', 'mp'];

const INCLUDED_FOLDERS: string[] = [];

interface Location {
  file: string;
  line: number;
}

interface SecretMatch {
  authType: string;
  authPattern: string;
  secretValue: string;
  authLocations: Location[]; // All places where auth pattern appears
  secretLocations: Location[]; // All places where secret appears
}

interface MaskedSecret {
  authConstName: string;
  secretConstName: string;
  authPattern: string;
  secretValue: string;
}

interface ModifiedFile {
  path: string;
  originalSecrets: {
    authPattern: string;
    secretValue: string;
    authLocations: Location[];
    secretLocations: Location[];
  }[];
  importedConstants: string[];
}

interface SecretChange {
  authPattern: string;
  secretValue: string;
  authConstName: string;
  secretConstName: string;
  changes: {
    auth: Location[]; // Will be populated from a Set
    secret: Location[]; // Will be populated from a Set
  };
}

// Updated interfaces for the new report structure
interface FileReport {
  modified: boolean;
  secrets: SecretChange[];
}

interface FolderReport {
  path: string;
  scannedFiles: Map<string, FileReport>;
  modified: boolean;
}

interface ReportData {
  folders: Map<string, FolderReport>;
}

// Main function
async function maskAuthSecrets(rootDir: string): Promise<ReportData> {
  // Create the new report structure
  const report: ReportData = {
    folders: new Map<string, FolderReport>(),
  };

  // Get all folders in the root directory
  const folders = await getAllFolders(rootDir);

  for (const folder of folders) {
    // Process each folder
    const folderResult = await processFolder(folder);

    // Create relative paths for files
    const relativePathBase = path.relative(rootDir, folder);

    // Initialize folder report
    const folderReport: FolderReport = {
      path: folder,
      scannedFiles: new Map<string, FileReport>(),
      modified: folderResult.maskedSecrets.length > 0,
    };

    // Get all files in the folder
    const allFiles = await getAllFiles(folder);

    // Initialize all files as unmodified
    for (const file of allFiles) {
      const relativePath = path.relative(folder, file);
      folderReport.scannedFiles.set(relativePath, {
        modified: false,
        secrets: [],
      });
    }

    // Process each modified file to collect changes
    if (folderResult.maskedSecrets.length > 0) {
      for (const modifiedFile of folderResult.modifiedFiles) {
        const relativePath = path.relative(folder, modifiedFile.path);
        const fileReport: FileReport = {
          modified: true,
          secrets: [],
        };

        // Create a map to track unique secret changes for this file
        const secretChangesMap = new Map<string, SecretChange>();

        for (const secret of modifiedFile.originalSecrets) {
          // Find the matching masked secret
          const matchingSecret = folderResult.maskedSecrets.find(
            (ms) => ms.authPattern === secret.authPattern && ms.secretValue === secret.secretValue,
          );

          if (matchingSecret) {
            const key = `${secret.authPattern}|${secret.secretValue}`;

            if (!secretChangesMap.has(key)) {
              // Initialize with empty arrays
              secretChangesMap.set(key, {
                authPattern: secret.authPattern,
                secretValue: secret.secretValue,
                authConstName: matchingSecret.authConstName,
                secretConstName: matchingSecret.secretConstName,
                changes: {
                  auth: [],
                  secret: [],
                },
              });
            }

            // Use Sets to collect unique locations
            const authLocationsSet = new Set<string>();
            const secretLocationsSet = new Set<string>();
            const change = secretChangesMap.get(key)!;

            // Add existing locations to sets
            change.changes.auth.forEach((loc) => {
              authLocationsSet.add(locationKey(loc));
            });
            change.changes.secret.forEach((loc) => {
              secretLocationsSet.add(locationKey(loc));
            });

            // Add new auth locations
            const authLocations = secret.authLocations.filter(
              (loc) => loc.file === modifiedFile.path,
            );
            for (const loc of authLocations) {
              const key = locationKey(loc);
              if (!authLocationsSet.has(key)) {
                authLocationsSet.add(key);
                change.changes.auth.push(loc);
              }
            }

            // Add new secret locations
            const secretLocations = secret.secretLocations.filter(
              (loc) => loc.file === modifiedFile.path,
            );
            for (const loc of secretLocations) {
              const key = locationKey(loc);
              if (!secretLocationsSet.has(key)) {
                secretLocationsSet.add(key);
                change.changes.secret.push(loc);
              }
            }
          }
        }

        // Add all collected changes to the file report
        fileReport.secrets = Array.from(secretChangesMap.values());

        // Update the file report in the folder
        folderReport.scannedFiles.set(relativePath, fileReport);
      }
    }

    // Add folder report to the main report
    report.folders.set(relativePathBase || folder, folderReport);
  }

  // Convert the report to a serializable format for JSON output
  const serializableReport = {
    folders: Array.from(report.folders.entries()).map(([folderPath, folderReport]) => ({
      path: folderPath,
      modified: folderReport.modified,
      scannedFiles: Array.from(folderReport.scannedFiles.entries()).map(
        ([filePath, fileReport]) => ({
          path: filePath,
          modified: fileReport.modified,
          secrets: fileReport.secrets,
        }),
      ),
    })),
  };

  // Write the report to a JSON file
  const reportPath = path.join('./', 'secrets-masking-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(serializableReport, null, 2));

  console.log(`Process completed. Report written to ${reportPath}`);

  return report;
}

// Get all folders in the root directory
async function getAllFolders(rootDir: string): Promise<string[]> {
  const folders: string[] = [];

  // Helper function to recursively get folders
  async function getDirectories(directory: string) {
    const items = fs.readdirSync(directory, { withFileTypes: true });

    // Get subdirectories
    for (const item of items) {
      if (item.isDirectory() && !EXCLUDED_FOLDERS.includes(item.name)) {
        if (INCLUDED_FOLDERS.length === 0 || INCLUDED_FOLDERS.includes(item.name)) {
          const fullPath = path.join(directory, item.name);
          folders.push(fullPath);
        }
      }
    }
  }

  await getDirectories(rootDir);
  return folders;
}

// Get all files in a folder, including nested ones
async function getAllFiles(folder: string): Promise<string[]> {
  const files: string[] = [];

  async function getFiles(directory: string) {
    const items = fs.readdirSync(directory, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(directory, item.name);

      if (item.isDirectory()) {
        await getFiles(fullPath);
      } else {
        files.push(fullPath);
      }
    }
  }

  await getFiles(folder);
  return files;
}

// Process a folder to find and mask secrets
async function processFolder(folder: string): Promise<{
  path: string;
  maskedSecretsPath: string | null;
  maskedSecrets: MaskedSecret[];
  modifiedFiles: ModifiedFile[];
}> {
  const files = await getAllFiles(folder);
  const secretMatches: SecretMatch[] = [];

  // Find all auth patterns and secrets
  for (const file of files) {
    const matches = await findAuthPatternsInFile(file, files);
    secretMatches.push(...matches);
  }

  // Create unique secrets
  const uniqueSecrets = createUniqueSecrets(secretMatches);

  // If we found secrets, create the maskedSecrets.ts file
  let maskedSecretsPath: string | null = null;
  const modifiedFiles: ModifiedFile[] = [];

  if (uniqueSecrets.length > 0) {
    // Create the maskedSecrets.ts file
    maskedSecretsPath = path.join(folder, 'maskedSecrets.ts');
    await createMaskedSecretsFile(maskedSecretsPath, uniqueSecrets);

    // Replace secrets in files
    for (const file of files) {
      // Only process files that have auth patterns or secrets
      const fileMatchesAuth = secretMatches.filter((match) =>
        match.authLocations.some((l) => l.file === file),
      );

      const fileMatchesSecret = secretMatches.filter((match) =>
        match.secretLocations.some((l) => l.file === file),
      );

      const fileMatches = [...new Set([...fileMatchesAuth, ...fileMatchesSecret])];

      if (fileMatches.length > 0) {
        const modifiedFile = await replaceSecretsInFile(
          file,
          fileMatches,
          uniqueSecrets,
          maskedSecretsPath,
        );
        modifiedFiles.push(modifiedFile);
      }
    }
  }

  return {
    path: folder,
    maskedSecretsPath,
    maskedSecrets: uniqueSecrets,
    modifiedFiles,
  };
}

// Find auth patterns in a file
async function findAuthPatternsInFile(
  filePath: string,
  allFilesInFolder: string[],
): Promise<SecretMatch[]> {
  const matches: Map<string, SecretMatch> = new Map();

  try {
    // First pass: find all auth patterns across files
    for (const file of allFilesInFolder) {
      // Skip non-JS/TS files
      if (
        !file.endsWith('.js') &&
        !file.endsWith('.ts') &&
        !file.endsWith('.jsx') &&
        !file.endsWith('.tsx')
      ) {
        continue;
      }

      const content = fs.readFileSync(file, 'utf-8');
      const lines = content.split('\n');

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Match authorization patterns: 'Authorization': 'Basic/Bearer/Token THE_SECRET'
        // Improved regex to catch more variants
        //   const regex = /Authorization['":]?\s*['":]?\s*(Basic|Bearer|Token)\s+([^'"]+)['"]/gi;
        const regex = /Authorization['":]?\s*['":]?\s*((Basic|Bearer|Token)\s+([^'"]+))['"]/gi;
        let match;

        while ((match = regex.exec(line)) !== null) {
          const authType = match[2]; // Basic, Bearer, or Token
          const secretValue = match[3]; // THE_SECRET
          const secretValues = getSecretValues(authType, secretValue);

          for (const secretValue of secretValues) {
            const authPattern = match[1]; // Remove surrounding quotes
            const matchKey = `${authPattern}|${secretValue}`;

            // Create or update the match entry
            if (!matches.has(matchKey)) {
              matches.set(matchKey, {
                authType,
                authPattern,
                secretValue,
                authLocations: [],
                secretLocations: [],
              });
            }

            // Add this auth location
            const existingMatch = matches.get(matchKey)!;
            if (
              !existingMatch.authLocations.some((loc) => loc.file === file && loc.line === i + 1)
            ) {
              existingMatch.authLocations.push({
                file,
                line: i + 1,
              });
            }
          }
        }
      }
    }

    // Second pass: find all secret values across files
    for (const match of matches.values()) {
      // Skip empty secrets or those that are too short (likely false positives)
      if (!match.secretValue || match.secretValue.trim().length < 5) {
        continue;
      }

      for (const file of allFilesInFolder) {
        // Skip non-JS/TS files
        if (
          !file.endsWith('.js') &&
          !file.endsWith('.ts') &&
          !file.endsWith('.jsx') &&
          !file.endsWith('.tsx')
        ) {
          continue;
        }

        const content = fs.readFileSync(file, 'utf-8');
        const lines = content.split('\n');

        // More precise regex that handles different quote styles
        const secretRegex = new RegExp(`['"\`]${escapeRegExp(match.secretValue)}['"\`]`, 'g');

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];

          // Reset lastIndex to ensure we catch all occurrences
          secretRegex.lastIndex = 0;

          if (secretRegex.test(line)) {
            // Avoid duplicates
            if (!match.secretLocations.some((loc) => loc.file === file && loc.line === i + 1)) {
              match.secretLocations.push({
                file,
                line: i + 1,
              });
            }
          }
        }
      }
    }

    // Only return matches that have both auth patterns and secrets found
    return Array.from(matches.values()).filter(
      (match) => match.authLocations.length > 0 && match.secretLocations.length > 0,
    );
  } catch (error) {
    console.error(`Error reading file ${filePath}: ${error}`);
    return [];
  }
}

// Create unique secrets from matches
function createUniqueSecrets(matches: SecretMatch[]): MaskedSecret[] {
  const uniqueSecrets: MaskedSecret[] = [];
  const secretMap = new Map<string, MaskedSecret>();
  let secretIndex = 1; // Start index from 1
  let authIndex = 1; // Start index from 1

  for (const match of matches) {
    // Create unique keys for auth patterns and secrets
    const secretKey = `secret:${match.secretValue}`;
    const authKey = `auth:${match.authPattern}`;

    // Check if we've seen this secret value before
    if (!secretMap.has(secretKey)) {
      // const secretConstName = toSnakeCase(secretKey);
      const secretConstName = `getSecret_${secretIndex}`;
      secretMap.set(secretKey, {
        authConstName: '', // Will be filled if needed
        secretConstName,
        authPattern: '', // Will be filled if needed
        secretValue: match.secretValue,
      });
      secretIndex++;
    }

    // Check if we've seen this auth pattern before
    if (!secretMap.has(authKey)) {
      // const authConstName = toSnakeCase(authKey);
      const authConstName = `getAuthHeader_${authIndex}`;
      secretMap.set(authKey, {
        authConstName,
        secretConstName: '', // Will be filled if needed
        authPattern: match.authPattern,
        secretValue: '', // Will be filled if needed
      });
      authIndex++;
    }

    // Create a full entry connecting both
    const fullKey = `${match.authPattern}|${match.secretValue}`;
    if (!secretMap.has(fullKey)) {
      const secretEntry = secretMap.get(secretKey)!;
      const authEntry = secretMap.get(authKey)!;

      secretMap.set(fullKey, {
        authConstName: authEntry.authConstName,
        secretConstName: secretEntry.secretConstName,
        authPattern: match.authPattern,
        secretValue: match.secretValue,
      });
    }
  }

  // Convert to array, only including entries with both auth and secret values
  for (const [key, entry] of secretMap.entries()) {
    if (key.includes('|') && entry.authConstName && entry.secretConstName) {
      uniqueSecrets.push(entry);
    }
  }

  return uniqueSecrets;
}

// Create the maskedSecrets.ts file
async function createMaskedSecretsFile(filePath: string, secrets: MaskedSecret[]): Promise<void> {
  let content = '\n\n';

  // Create a map to eliminate duplicates
  const constantsMap = new Map<string, string>();

  for (const secret of secrets) {
    constantsMap.set(
      secret.authConstName,
      `export const ${secret.authConstName} = () => '${secret.authPattern}';\n`,
    );
    constantsMap.set(
      secret.secretConstName,
      `export const ${secret.secretConstName} = () => '${secret.secretValue}';\n`,
    );
  }

  // Add all unique constants to the file
  for (const constLine of constantsMap.values()) {
    content += constLine;
  }

  fs.writeFileSync(filePath, content);
}

// Replace secrets in a file
async function replaceSecretsInFile(
  filePath: string,
  matches: SecretMatch[],
  uniqueSecrets: MaskedSecret[],
  maskedSecretsPath: string,
): Promise<ModifiedFile> {
  // Read the file
  let content = fs.readFileSync(filePath, 'utf-8');
  const originalSecrets: {
    authPattern: string;
    secretValue: string;
    authLocations: Location[];
    secretLocations: Location[];
  }[] = [];
  const importedConstants: string[] = [];

  // Create mapping for quick lookup
  const secretsMap = new Map<string, MaskedSecret>();
  for (const secret of uniqueSecrets) {
    secretsMap.set(`${secret.authPattern}|${secret.secretValue}`, secret);
  }

  // Track which constants we need to import
  const neededConstants = new Set<string>();

  // First collect all secrets that need to be replaced
  for (const match of matches) {
    const key = `${match.authPattern}|${match.secretValue}`;
    const secret = secretsMap.get(key);

    if (secret) {
      // Check if this file has auth patterns that need replacing
      const hasAuthLocations = match.authLocations.some((loc) => loc.file === filePath);
      if (hasAuthLocations) {
        neededConstants.add(secret.authConstName);
      }

      // Check if this file has secret values that need replacing
      const hasSecretLocations = match.secretLocations.some((loc) => loc.file === filePath);
      if (hasSecretLocations) {
        neededConstants.add(secret.secretConstName);
      }

      // Add to original secrets for the report
      originalSecrets.push({
        authPattern: match.authPattern,
        secretValue: match.secretValue,
        authLocations: match.authLocations.filter((loc) => loc.file === filePath),
        secretLocations: match.secretLocations.filter((loc) => loc.file === filePath),
      });
    }
  }

  // If we have secrets to replace
  if (neededConstants.size > 0) {
    // Create import statement
    const relativeImportPath = path.relative(
      path.dirname(filePath),
      path.dirname(maskedSecretsPath),
    );
    let importPath = path.join(relativeImportPath, path.basename(maskedSecretsPath, '.ts'));

    // Normalize import path for different OS
    importPath = importPath.replace(/\\/g, '/');

    // If it doesn't start with ./ or ../, add ./
    if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
      importPath = `./${importPath}`;
    }

    // Add import statement
    const importConstants = Array.from(neededConstants);
    importedConstants.push(...importConstants);

    const importStatement = `import { ${importConstants.join(', ')} } from '${importPath}';\n`;

    // Always add imports at the top of the file
    content = importStatement + content;

    // Replace auth patterns and secrets independently
    for (const match of matches) {
      const key = `${match.authPattern}|${match.secretValue}`;
      const secret = secretsMap.get(key);

      if (secret) {
        // Replace auth patterns if this file has them
        if (match.authLocations.some((loc) => loc.file === filePath)) {
          // More precise pattern matching to avoid false replacements
          const authPattern = `['"\`]${escapeRegExp(match.authPattern)}['"\`]`;
          const authRegex = new RegExp(authPattern, 'g');
          content = content.replace(authRegex, `${secret.authConstName}()`);
        }

        // Replace secret values if this file has them
        if (match.secretLocations.some((loc) => loc.file === filePath)) {
          // More precise pattern matching to avoid false replacements
          const secretPattern = `['"\`]${escapeRegExp(match.secretValue)}['"\`]`;
          const secretRegex = new RegExp(secretPattern, 'g');
          content = content.replace(secretRegex, `${secret.secretConstName}()`);
        }
      }
    }

    // Write the modified content back to the file
    fs.writeFileSync(filePath, content);
  }

  return {
    path: filePath,
    originalSecrets,
    importedConstants,
  };
}

// Helper function to escape special characters in regex
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Add this helper function to create a unique key for a Location
function locationKey(loc: Location): string {
  return `${loc.file}:${loc.line}`;
}

function toSnakeCase(text: string): string {
  return text
    .replace(/([a-z])([A-Z])/g, '$1_$2') // Insert underscore between camelCase transitions
    .replace(/[^a-zA-Z0-9]+/g, '_') // Replace non-alphanumeric characters with underscores
    .replace(/^_+|_+$/g, '') // Trim leading/trailing underscores
    .toUpperCase();
}

function getSecretValues(authType: string, secretValue: string): string[] {
  if (authType === 'Basic') {
    const decodedSecret = Buffer.from(secretValue, 'base64').toString();
    const decodedSecretArray = decodedSecret.trim().split(':');
    if (decodedSecretArray.length === 1) {
      return [secretValue, decodedSecretArray[0], decodedSecret.trim()];
    }
    return [secretValue, ...decodedSecretArray];
  }
  return [secretValue];
}

// Execute the script if run directly
if (require.main === module) {
  const rootDir = process.argv[2] || path.join(__dirname, '../integrations/destinations/');
  maskAuthSecrets(path.resolve(rootDir))
    .then(() => console.log('Completed successfully!'))
    .catch((error) => console.error('Error:', error));
}

export { maskAuthSecrets };

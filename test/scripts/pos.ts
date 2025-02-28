import * as fs from 'fs';
import * as path from 'path';

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

interface FolderResult {
  path: string;
  maskedSecretsPath: string | null;
  maskedSecrets: MaskedSecret[];
  modifiedFiles: ModifiedFile[];
}

interface ReportData {
  scannedFolders: string[];
  scannedFiles: string[];
  folderResults: FolderResult[];
}

// Main function
async function maskAuthSecrets(rootDir: string): Promise<ReportData> {
  const report: ReportData = {
    scannedFolders: [],
    scannedFiles: [],
    folderResults: [],
  };

  // Get all folders in the root directory
  const folders = await getAllFolders(rootDir);
  report.scannedFolders = folders;

  for (const folder of folders) {
    // Process each folder
    const folderResult = await processFolder(folder);
    report.scannedFiles.push(...folderResult.modifiedFiles.map((f) => f.path));
    report.folderResults.push(folderResult);
  }

  // Write the report to a JSON file
  const reportPath = path.join(rootDir, 'secrets-masking-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log(`Process completed. Report written to ${reportPath}`);

  return report;
}

// Get all folders in the root directory
async function getAllFolders(rootDir: string): Promise<string[]> {
  const folders: string[] = [];

  // Helper function to recursively get folders
  async function getDirectories(directory: string) {
    const items = fs.readdirSync(directory, { withFileTypes: true });

    // Add the current directory
    folders.push(directory);

    // Get subdirectories
    for (const item of items) {
      if (item.isDirectory()) {
        const fullPath = path.join(directory, item.name);
        await getDirectories(fullPath);
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
async function processFolder(folder: string): Promise<FolderResult> {
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
      const fileMatches = secretMatches.filter((match) =>
        match.authLocations.some((l) => l.file === file),
      );

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
      const content = fs.readFileSync(file, 'utf-8');
      const lines = content.split('\n');

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Match authorization patterns: 'Authorization': 'Basic/Bearer/Token THE_SECRET'
        const regex = /'Authorization':\s*'(Basic|Bearer|Token)\s+([^']+)'/g;
        let match;

        while ((match = regex.exec(line)) !== null) {
          const authType = match[1]; // Basic, Bearer, or Token
          const secretValue = match[2]; // THE_SECRET
          const authPattern = `${authType} ${secretValue}`;

          // Create or update the match entry
          if (!matches.has(authPattern)) {
            matches.set(authPattern, {
              authType,
              authPattern,
              secretValue,
              authLocations: [],
              secretLocations: [],
            });
          }

          // Add this auth location
          matches.get(authPattern)!.authLocations.push({
            file,
            line: i + 1,
          });
        }
      }
    }

    // Second pass: find all secret values across files
    for (const match of matches.values()) {
      for (const file of allFilesInFolder) {
        const content = fs.readFileSync(file, 'utf-8');
        const lines = content.split('\n');

        const secretRegex = new RegExp(`['"]${escapeRegExp(match.secretValue)}['"]`, 'g');

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (secretRegex.test(line)) {
            match.secretLocations.push({
              file,
              line: i + 1,
            });
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
  const seen = new Set<string>();
  let index = 1; // Start index from 1

  for (const match of matches) {
    const key = `${match.authPattern}|${match.secretValue}`;

    if (!seen.has(key)) {
      seen.add(key);

      uniqueSecrets.push({
        authConstName: `AUTH_PATTERN_${index}`,
        secretConstName: `SECRET_${index}`,
        authPattern: match.authPattern,
        secretValue: match.secretValue,
      });

      index++; // Increment index for next unique secret
    }
  }

  return uniqueSecrets;
}

// Create the maskedSecrets.ts file
async function createMaskedSecretsFile(filePath: string, secrets: MaskedSecret[]): Promise<void> {
  let content = '// Auto-generated masked secrets file\n\n';

  for (const secret of secrets) {
    content += `export const ${secret.authConstName} = { 'Authorization': '${secret.authPattern.replace(secret.secretValue, `' + ${secret.secretConstName} + '`)}' };\n`;
    content += `export const ${secret.secretConstName} = '${secret.secretValue}';\n\n`;
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

  // Find unique secrets in this file
  const secretsInFile = new Map<string, MaskedSecret>();

  for (const match of matches) {
    for (const secret of uniqueSecrets) {
      if (match.authPattern === secret.authPattern && match.secretValue === secret.secretValue) {
        secretsInFile.set(`${secret.authConstName}|${secret.secretConstName}`, secret);
        originalSecrets.push({
          authPattern: match.authPattern,
          secretValue: match.secretValue,
          authLocations: match.authLocations,
          secretLocations: match.secretLocations,
        });
      }
    }
  }

  // If we have secrets to replace
  if (secretsInFile.size > 0) {
    // Create import statement
    const relativeImportPath = path.relative(
      path.dirname(filePath),
      path.dirname(maskedSecretsPath),
    );
    let importPath = path.join(relativeImportPath, path.basename(maskedSecretsPath, '.ts'));

    // Normalize import path for different OS
    importPath = importPath.replace(/\\/g, '/');

    // If it doesn't start with ./ or ../, add ./
    if (!importPath.startsWith('.')) {
      importPath = `./${importPath}`;
    }

    // Add import statement
    const importConstants: string[] = [];
    for (const secret of secretsInFile.values()) {
      importConstants.push(secret.authConstName, secret.secretConstName);
      importedConstants.push(secret.authConstName, secret.secretConstName);
    }

    const importStatement = `import { ${importConstants.join(', ')} } from '${importPath}';\n`;

    // Check if we need to add the import statement
    // If the file already has imports, add ours after the last import
    if (content.includes('import ')) {
      // Find the last import statement
      const importMatches = content.match(/import .*?;/gs);
      if (importMatches) {
        const lastImport = importMatches[importMatches.length - 1];
        const lastImportIndex = content.lastIndexOf(lastImport) + lastImport.length;
        content = `${content.slice(0, lastImportIndex)}\n${importStatement}${content.slice(lastImportIndex)}`;
      }
    } else {
      // No imports, add at the beginning
      content = importStatement + content;
    }

    // Replace auth patterns
    for (const secret of secretsInFile.values()) {
      const authPattern = `'Authorization':\\s*'${escapeRegExp(secret.authPattern)}'`;
      const authRegex = new RegExp(authPattern, 'g');
      content = content.replace(authRegex, `'Authorization': ${secret.authConstName}`);

      // Replace secrets
      const secretPattern = `(['"])${escapeRegExp(secret.secretValue)}(['"])`;
      const secretRegex = new RegExp(secretPattern, 'g');
      content = content.replace(secretRegex, `$1${secret.secretConstName}$2`);
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

// Execute the script if run directly
if (require.main === module) {
  const rootDir = process.argv[2] || 'test/integrations/destinations';
  maskAuthSecrets(path.resolve(rootDir))
    .then(() => console.log('Completed successfully!'))
    .catch((error) => console.error('Error:', error));
}

export { maskAuthSecrets };

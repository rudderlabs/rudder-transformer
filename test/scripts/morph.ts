import {
  Project,
  SyntaxKind,
  Node,
  SourceFile,
  ArrayLiteralExpression,
  ObjectLiteralExpression,
  StringLiteral,
  PropertyAssignment,
  SpreadElement,
} from 'ts-morph';
import * as path from 'path';
import * as fs from 'fs';
import { getTestDataFilePaths } from '../integrations/testUtils';
import { program } from 'commander';

// Parse command line options
program
  .option('-d, --destination <destination>', 'Process specific destination')
  .option('-f, --feature <feature>', 'Process specific feature')
  .parse(process.argv);

const opts = program.opts();

// Configuration
const testUtilsPath = path.resolve(__dirname, '../integrations/testUtils');
const variableName = 'DUMMY_SECRET'; // Variable name to use for secrets

// Function to process a single file
function processDataFile(filePath: string) {
  console.log(`Processing ${filePath}...`);

  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(filePath);

  // Calculate relative path to testUtils from the current file
  const fileDir = path.dirname(filePath);
  const relativeTestUtilsPath = path.relative(fileDir, testUtilsPath).replace(/\\/g, '/');

  // Track replacements
  let replacements: Map<
    string,
    {
      type: string;
      value: string;
      secrets: string[];
      variableNames: string[];
      token?: string;
    }
  >;

  // Function to find all exported arrays in the file
  function findExportedArrays(file: SourceFile): ArrayLiteralExpression[] {
    const arrays: ArrayLiteralExpression[] = [];

    // Find direct array exports
    const exportedVars = file.getVariableDeclarations().filter((varDecl) => {
      const declaration = varDecl.getVariableStatement();
      return (
        declaration?.isExported() &&
        varDecl.getInitializer()?.getKind() === SyntaxKind.ArrayLiteralExpression
      );
    });

    // Add direct array exports
    for (const varDecl of exportedVars) {
      const arrayExpr = varDecl.getInitializerIfKind(SyntaxKind.ArrayLiteralExpression);
      if (arrayExpr) {
        arrays.push(arrayExpr);
      }
    }

    // Find arrays that are composed using spread operators
    const exportedArrays = file.getVariableDeclarations().filter((varDecl) => {
      const declaration = varDecl.getVariableStatement();
      const initializer = varDecl.getInitializer();
      return (
        declaration?.isExported() &&
        initializer?.getKind() === SyntaxKind.ArrayLiteralExpression &&
        (initializer as ArrayLiteralExpression)
          .getElements()
          .some((el) => el.getKind() === SyntaxKind.SpreadElement)
      );
    });

    // Process spread elements
    for (const arrayDecl of exportedArrays) {
      const arrayExpr = arrayDecl.getInitializerIfKind(SyntaxKind.ArrayLiteralExpression);
      if (arrayExpr) {
        // For each spread element, try to resolve the referenced array
        for (const element of arrayExpr.getElements()) {
          if (element.getKind() === SyntaxKind.SpreadElement) {
            const spreadElement = element as SpreadElement;
            const spreadExpr = spreadElement.getExpression();

            if (spreadExpr.getKind() === SyntaxKind.Identifier) {
              const varName = spreadExpr.getText();
              // Try to find the variable in the current file
              const referencedVar = file.getVariableDeclaration(varName);
              if (referencedVar) {
                const referencedArray = referencedVar.getInitializerIfKind(
                  SyntaxKind.ArrayLiteralExpression,
                );
                if (referencedArray) {
                  arrays.push(referencedArray);
                }
              } else {
                // Try to find in imports
                const importDecl = file.getImportDeclaration((decl) => {
                  return decl.getNamedImports().some((imp) => imp.getName() === varName);
                });

                if (importDecl) {
                  const moduleSpecifier = importDecl
                    .getModuleSpecifier()
                    .getText()
                    .replace(/['"]/g, '');
                  const importedFile = project.getSourceFile(moduleSpecifier);
                  if (importedFile) {
                    const exportedVar = importedFile.getVariableDeclaration(varName);
                    const importedArray = exportedVar?.getInitializerIfKind(
                      SyntaxKind.ArrayLiteralExpression,
                    );
                    if (importedArray) {
                      arrays.push(importedArray);
                    }
                  }
                }
              }
            }
          }
        }
        // Don't forget to add the original array itself
        arrays.push(arrayExpr);
      }
    }

    return arrays;
  }

  // Function to extract and parse authorization header
  function parseAuthorizationHeader(
    headerValue: string,
  ): { type: string; secrets: string[]; lastCharColon: boolean; token: string } | null {
    if (!headerValue) return null;

    // Remove quotes from the string
    const cleanValue = headerValue.replace(/['"]/g, '');

    // Extract token based on common patterns
    if (cleanValue.startsWith('Bearer ')) {
      const token = cleanValue.split('Bearer ')[1].trim();
      return { type: 'Bearer', secrets: [token], lastCharColon: false, token };
    }
    if (cleanValue.startsWith('Basic ')) {
      try {
        const token = cleanValue.split('Basic ')[1].trim();
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        // For Basic auth, we might have username:password format
        const secrets = decoded.split(':');
        return {
          type: 'Basic',
          secrets: secrets.filter((secret) => secret !== ''),
          lastCharColon: decoded.endsWith(':'),
          token,
        };
      } catch (e) {
        console.error('Error decoding Basic auth:', e);
        return null;
      }
    }
    if (cleanValue.startsWith('Token ')) {
      const token = cleanValue.split('Token ')[1].trim();
      const tokenKeyValue = token.split('=');
      return {
        type: 'Token',
        secrets: [tokenKeyValue.length > 1 ? tokenKeyValue[1] : tokenKeyValue[0]],
        lastCharColon: false,
        token,
      };
    }
    return null;
  }

  // Generate appropriate variable names for secrets
  function generateVariableNames(type: string, secrets: string[]): string[] {
    // For simplicity, we'll use the same variable name for all secrets
    return secrets.map(() => variableName);
  }

  // New helper function to resolve variable declarations
  function resolveVariable(node: Node): Node | null {
    if (node.getKind() === SyntaxKind.Identifier) {
      // Try to find variable in current file
      const identifier = node.getText();
      const varDecl = sourceFile.getVariableDeclaration(identifier);
      if (varDecl) {
        const initializer = varDecl.getInitializer();
        return initializer || null;
      }

      // Try to find in imports
      const importDecl = sourceFile.getImportDeclaration((decl) => {
        return decl.getNamedImports().some((imp) => imp.getName() === identifier);
      });
      if (importDecl) {
        const moduleSpecifier = importDecl.getModuleSpecifier().getText().replace(/['"]/g, '');
        const importedFile = project.getSourceFile(moduleSpecifier);
        if (importedFile) {
          const exportedVar = importedFile.getVariableDeclaration(identifier);
          return exportedVar?.getInitializer() || null;
        }
      }
    }
    return null;
  }

  // Function to resolve and process imported objects
  function resolveAndProcessObject(node: Node): ObjectLiteralExpression | null {
    if (node.getKind() === SyntaxKind.Identifier) {
      const resolved = resolveVariable(node);
      if (resolved?.getKind() === SyntaxKind.ObjectLiteralExpression) {
        return resolved as ObjectLiteralExpression;
      }
    } else if (node.getKind() === SyntaxKind.ObjectLiteralExpression) {
      return node as ObjectLiteralExpression;
    }
    return null;
  }

  // Function to find Authorization headers in an object
  function findAuthorizationHeader(
    obj: ObjectLiteralExpression,
    replacements: Map<string, any>,
  ): void {
    // Check direct properties
    for (const prop of obj.getProperties()) {
      if (prop.getKind() !== SyntaxKind.PropertyAssignment) continue;

      const propAssignment = prop as PropertyAssignment;
      const initializer = propAssignment.getInitializer();

      // Check for 'headers' property that might contain Authorization
      const propName = propAssignment.getName().replace(/['"]/g, '');
      if (propName === 'headers') {
        let value = propAssignment.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);

        // If it's an identifier, try to resolve it
        if (!value && initializer?.getKind() === SyntaxKind.Identifier) {
          const resolved = resolveVariable(initializer);
          if (resolved?.getKind() === SyntaxKind.ObjectLiteralExpression) {
            value = resolved as ObjectLiteralExpression;
          }
        }

        if (value) {
          // Look for Authorization property in headers
          for (const headerProp of value.getProperties()) {
            if (headerProp.getKind() !== SyntaxKind.PropertyAssignment) continue;

            const headerPropAssignment = headerProp as PropertyAssignment;
            const headerName = headerPropAssignment.getName().replace(/['"]/g, '');

            if (headerName === 'Authorization') {
              const headerValue = headerPropAssignment.getInitializer()?.getText();
              if (headerValue) {
                const parsed = parseAuthorizationHeader(headerValue);
                if (parsed) {
                  const { type, secrets, lastCharColon, token } = parsed;
                  const variableNames = generateVariableNames(type, secrets);

                  // Store the replacement info for later use
                  const key = type === 'Basic' ? secrets.join(':') : secrets[0];
                  replacements.set(key, {
                    type,
                    value: headerValue,
                    secrets,
                    variableNames,
                    token,
                  });

                  // Replace with appropriate template literal
                  if (type === 'Basic') {
                    // Join all variable names with ':' and append ':' if only one secret
                    if (lastCharColon) {
                      headerPropAssignment.setInitializer(
                        `\`${type} \${basicEncoded(${variableNames[0] + '+":"'}, 1)}\``,
                      );
                    } else {
                      headerPropAssignment.setInitializer(
                        `\`${type} \${basicEncoded(${variableNames[0]}, ${variableNames.length})}\``,
                      );
                    }
                  } else {
                    headerPropAssignment.setInitializer(`\`${type} \${${variableNames[0]}}\``);
                  }

                  console.log(`Found ${type} auth with ${secrets.length} secret(s)`);
                }
              }
            }
          }
        }
      }

      // Handle nested objects, including resolved variables
      let objInitializer = propAssignment.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
      if (!objInitializer && initializer?.getKind() === SyntaxKind.Identifier) {
        const resolved = resolveVariable(initializer);
        if (resolved?.getKind() === SyntaxKind.ObjectLiteralExpression) {
          objInitializer = resolved as ObjectLiteralExpression;
        }
      }
      if (objInitializer) {
        findAuthorizationHeader(objInitializer, replacements);
      }

      // Handle array initializers
      let arrayInitializer = propAssignment.getInitializerIfKind(SyntaxKind.ArrayLiteralExpression);
      if (!arrayInitializer && initializer?.getKind() === SyntaxKind.Identifier) {
        const resolved = resolveVariable(initializer);
        if (resolved?.getKind() === SyntaxKind.ArrayLiteralExpression) {
          arrayInitializer = resolved as ArrayLiteralExpression;
        }
      }
      if (arrayInitializer) {
        processArrayLiteral(arrayInitializer);
      }
    }
  }

  // Function to process test case object (contains input and output)
  function processTestCase(testCase: ObjectLiteralExpression): void {
    // Create a new replacements map for this test case
    replacements = new Map();

    // First pass: find all authorization headers in the output and input
    for (const prop of testCase.getProperties()) {
      if (prop.getKind() !== SyntaxKind.PropertyAssignment) continue;

      const propAssignment = prop as PropertyAssignment;
      const propName = propAssignment.getName().replace(/['"]/g, '');

      if (propName === 'output' || propName === 'input') {
        // Handle object initializer
        const objInitializer = propAssignment.getInitializerIfKind(
          SyntaxKind.ObjectLiteralExpression,
        );
        if (objInitializer) {
          findAuthorizationHeader(objInitializer, replacements);
          // Also look for nested destination objects
          findNestedDestinationObjects(objInitializer);
        }

        // Handle array initializer
        const arrayInitializer = propAssignment.getInitializerIfKind(
          SyntaxKind.ArrayLiteralExpression,
        );
        if (arrayInitializer) {
          processArrayLiteral(arrayInitializer);
        }
      } else if (propName === 'destination') {
        // Process destination object directly
        const initializer = propAssignment.getInitializer();
        if (initializer) {
          const destinationObj = resolveAndProcessObject(initializer);
          if (destinationObj) {
            findAuthorizationHeader(destinationObj, replacements);
          }
        }
      }
    }

    // Second pass: replace all secrets found in both input and output
    if (replacements.size > 0) {
      replaceSecrets(testCase);

      // Add imports if needed
      addRequiredImports();

      // Log summary for this test case
      console.log('\nVariable replacements for current test case:');
      for (const [key, replacement] of replacements.entries()) {
        const secretSummary =
          replacement.secrets.length > 1
            ? replacement.secrets
                .map((s, i) => `${s.substring(0, 3)}... → ${replacement.variableNames[i]}`)
                .join(', ')
            : `${replacement.secrets[0].substring(0, 3)}... → ${replacement.variableNames[0]}`;

        console.log(`- ${replacement.type}: ${secretSummary}`);
      }
    }

    // Clear replacements for next test case
    replacements.clear();
  }

  // Function to add required imports based on replacements
  function addRequiredImports(): void {
    if (replacements.size > 0) {
      const importDeclaration = sourceFile.getImportDeclaration(
        (decl) => decl.getModuleSpecifierValue() === relativeTestUtilsPath,
      );

      const needsEncodedFunction = Array.from(replacements.values()).some(
        (r) => r.type === 'Basic',
      );

      if (importDeclaration) {
        const namedImports = importDeclaration.getNamedImports().map((imp) => imp.getName());
        if (!namedImports.includes(variableName)) {
          importDeclaration.addNamedImport(variableName);
        }
        if (needsEncodedFunction && !namedImports.includes('basicEncoded')) {
          importDeclaration.addNamedImport('basicEncoded');
        }
      } else {
        const namedImports = [variableName];
        if (needsEncodedFunction) {
          namedImports.push('basicEncoded');
        }
        sourceFile.addImportDeclaration({
          namedImports,
          moduleSpecifier: relativeTestUtilsPath,
        });
      }
    }
  }

  // Function to find nested destination objects in a structure
  function findNestedDestinationObjects(obj: ObjectLiteralExpression): void {
    for (const prop of obj.getProperties()) {
      if (prop.getKind() !== SyntaxKind.PropertyAssignment) continue;

      const propAssignment = prop as PropertyAssignment;
      const propName = propAssignment.getName().replace(/['"]/g, '');
      const initializer = propAssignment.getInitializer();

      if (propName === 'destination') {
        // Process destination object
        const destinationObj = resolveAndProcessObject(initializer as Node);
        if (destinationObj) {
          findAuthorizationHeader(destinationObj, replacements);
        }
      } else {
        // Recursively process nested objects
        if (initializer?.getKind() === SyntaxKind.ObjectLiteralExpression) {
          findNestedDestinationObjects(initializer as ObjectLiteralExpression);
        } else if (initializer?.getKind() === SyntaxKind.ArrayLiteralExpression) {
          // Process arrays that might contain objects with destination
          const arrayLiteral = initializer as ArrayLiteralExpression;
          for (const element of arrayLiteral.getElements()) {
            if (element.getKind() === SyntaxKind.ObjectLiteralExpression) {
              findNestedDestinationObjects(element as ObjectLiteralExpression);
            } else if (element.getKind() === SyntaxKind.Identifier) {
              const resolved = resolveVariable(element);
              if (resolved?.getKind() === SyntaxKind.ObjectLiteralExpression) {
                findNestedDestinationObjects(resolved as ObjectLiteralExpression);
              }
            }
          }
        } else if (initializer?.getKind() === SyntaxKind.Identifier) {
          // Handle imported/referenced objects
          const resolved = resolveVariable(initializer);
          if (resolved?.getKind() === SyntaxKind.ObjectLiteralExpression) {
            findNestedDestinationObjects(resolved as ObjectLiteralExpression);
          }
        }
      }
    }
  }

  // Update processArrayLiteral to handle nested destination objects
  function processArrayLiteral(array: ArrayLiteralExpression): void {
    for (const element of array.getElements()) {
      if (element.getKind() === SyntaxKind.ObjectLiteralExpression) {
        const obj = element as ObjectLiteralExpression;
        findAuthorizationHeader(obj, replacements);
        findNestedDestinationObjects(obj);
      } else if (element.getKind() === SyntaxKind.ArrayLiteralExpression) {
        processArrayLiteral(element as ArrayLiteralExpression);
      } else if (element.getKind() === SyntaxKind.Identifier) {
        const resolved = resolveVariable(element);
        if (resolved) {
          if (resolved.getKind() === SyntaxKind.ObjectLiteralExpression) {
            const obj = resolved as ObjectLiteralExpression;
            findAuthorizationHeader(obj, replacements);
            findNestedDestinationObjects(obj);
          } else if (resolved.getKind() === SyntaxKind.ArrayLiteralExpression) {
            processArrayLiteral(resolved as ArrayLiteralExpression);
          }
        }
      }
    }
  }

  // Set to track visited nodes
  const visitedNodes = new Set<Node>();

  // Recursively search for secrets in string literals and replace them
  function replaceSecrets(node: Node): void {
    if (visitedNodes.has(node)) {
      return;
    }
    visitedNodes.add(node);

    if (node.getKind() === SyntaxKind.StringLiteral) {
      const stringLiteral = node as StringLiteral;
      const literalValue = stringLiteral.getLiteralValue();

      // Check against all found secrets
      for (const [key, replacement] of replacements.entries()) {
        // First try to match individual secrets
        for (let i = 0; i < replacement.secrets.length; i++) {
          const secret = replacement.secrets[i];
          const varName = replacement.variableNames[i];

          if (secret !== '' && literalValue.includes(secret)) {
            console.log(`Replacing secret in string literal with ${varName}`);
            const newValue = literalValue.replace(secret, `\${${varName}}`);
            stringLiteral.replaceWithText(`\`${newValue}\``);
            return;
          }
        }

        // If no secrets matched, try matching the full token value
        // const tokenValue = replacement.value.replace(/['"]/g, ''); // Remove quotes
        const tokenValue = replacement.token;
        if (tokenValue && literalValue.includes(tokenValue)) {
          console.log(`Replacing token in string literal with ${replacement.variableNames[0]}`);
          const newValue = literalValue.replace(tokenValue, `\${${replacement.variableNames[0]}}`);
          stringLiteral.replaceWithText(`\`${newValue}\``);
          return;
        }
      }
    } else if (node.getKind() === SyntaxKind.Identifier) {
      ``;
      const resolved = resolveVariable(node);
      if (resolved && !visitedNodes.has(resolved)) {
        replaceSecrets(resolved);
      }
    }

    for (const child of node.getChildren()) {
      if (!visitedNodes.has(child)) {
        replaceSecrets(child);
      }
    }
  }

  // Main function to process the file
  function processFile() {
    // Find all exported arrays
    const arrays = findExportedArrays(sourceFile);
    if (arrays.length === 0) {
      console.error('Could not find any exported arrays');
      return;
    }

    console.log(`Found ${arrays.length} exported arrays`);
    let totalReplacements = 0;

    // Process each array
    for (const array of arrays) {
      const elements = array.getElements();
      console.log(`Processing array with ${elements.length} elements`);

      for (const element of elements) {
        if (element.getKind() === SyntaxKind.ObjectLiteralExpression) {
          processTestCase(element as ObjectLiteralExpression);
          totalReplacements += replacements.size;
        } else if (element.getKind() === SyntaxKind.SpreadElement) {
          const spreadElement = element as SpreadElement;
          const spreadExpr = spreadElement.getExpression();

          if (spreadExpr.getKind() === SyntaxKind.Identifier) {
            const resolved = resolveVariable(spreadExpr);
            if (resolved?.getKind() === SyntaxKind.ArrayLiteralExpression) {
              const resolvedArray = resolved as ArrayLiteralExpression;
              for (const item of resolvedArray.getElements()) {
                if (item.getKind() === SyntaxKind.ObjectLiteralExpression) {
                  processTestCase(item as ObjectLiteralExpression);
                  totalReplacements += replacements.size;
                }
              }
            }
          }
        }
      }
    }

    sourceFile.saveSync();
    console.log(`Updated ${filePath} with ${totalReplacements} total replacements`);
  }

  processFile();
}

// Function to check if file should be processed
function shouldProcessFile(filePath: string): boolean {
  // Skip files in dataDelivery folder
  return !filePath.includes('/dataDelivery/') && !filePath.includes('\\dataDelivery\\');
}

async function main() {
  // Get all data.ts files from destinations
  const testIntegrationsPath = path.resolve(__dirname, '../integrations/destinations');
  const dataFiles = getTestDataFilePaths(testIntegrationsPath, opts);

  // Filter out dataDelivery files
  const filesToProcess = dataFiles.filter(shouldProcessFile);

  console.log(`Found ${dataFiles.length} total data files`);
  console.log(`Processing ${filesToProcess.length} files (excluding dataDelivery)`);

  // Process each file
  for (const filePath of filesToProcess) {
    try {
      processDataFile(filePath);
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error);
      throw error;
    }
  }
}

// Run the script
main().catch((error) => {
  console.error('Script failed:', error);
  process.exit(1);
});

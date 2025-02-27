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
import { getTestDataFilePaths } from '../integrations/testUtils';
import { program } from 'commander';

// Constants
const VARIABLE_NAME = 'DUMMY_SECRET';
const AUTH_TYPES = {
  BEARER: 'Bearer',
  BASIC: 'Basic',
  TOKEN: 'Token',
};

// Command line options setup
program
  .option('-d, --destination <destination>', 'Process specific destination')
  .option('-f, --feature <feature>', 'Process specific feature')
  .parse(process.argv);

const opts = program.opts();

// Types
interface Replacement {
  type: string;
  value: string;
  secrets: string[];
  variableNames: string[];
}

interface AuthHeaderInfo {
  type: string;
  secrets: string[];
}

class SecretProcessor {
  private project: Project;
  private sourceFile: SourceFile;
  private testUtilsPath: string;
  private relativeTestUtilsPath: string;
  private replacements: Map<string, Replacement>;
  private visitedNodes: Set<Node>;

  constructor(filePath: string) {
    this.project = new Project();
    this.sourceFile = this.project.addSourceFileAtPath(filePath);
    this.testUtilsPath = path.resolve(__dirname, '../integrations/testUtils');
    this.relativeTestUtilsPath = path
      .relative(path.dirname(filePath), this.testUtilsPath)
      .replace(/\\/g, '/');
    this.replacements = new Map();
    this.visitedNodes = new Set();
  }

  public process(): void {
    const arrays = this.findExportedArrays();
    if (arrays.length === 0) {
      console.error('Could not find any exported arrays');
      return;
    }

    console.log(`Found ${arrays.length} exported arrays`);

    // Process each array
    for (const array of arrays) {
      this.processArray(array);
    }

    // Add imports if changes were made
    if (this.replacements.size > 0) {
      this.addRequiredImports();
      this.saveChanges();
      this.logSummary();
    } else {
      console.log('No secrets found or no changes made');
    }
  }

  private findExportedArrays(): ArrayLiteralExpression[] {
    const arrays: ArrayLiteralExpression[] = [];

    // Find directly exported arrays
    this.findDirectExportedArrays(arrays);

    // Find arrays composed using spread operators
    this.findSpreadComposedArrays(arrays);

    return arrays;
  }

  private findDirectExportedArrays(arrays: ArrayLiteralExpression[]): void {
    const exportedVars = this.sourceFile.getVariableDeclarations().filter((varDecl) => {
      const declaration = varDecl.getVariableStatement();
      return (
        declaration?.isExported() &&
        varDecl.getInitializer()?.getKind() === SyntaxKind.ArrayLiteralExpression
      );
    });

    for (const varDecl of exportedVars) {
      const arrayExpr = varDecl.getInitializerIfKind(SyntaxKind.ArrayLiteralExpression);
      if (arrayExpr) {
        arrays.push(arrayExpr);
      }
    }
  }

  private findSpreadComposedArrays(arrays: ArrayLiteralExpression[]): void {
    const exportedArrays = this.sourceFile.getVariableDeclarations().filter((varDecl) => {
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

    for (const arrayDecl of exportedArrays) {
      const arrayExpr = arrayDecl.getInitializerIfKind(SyntaxKind.ArrayLiteralExpression);
      if (!arrayExpr) continue;

      // Add the main array itself
      arrays.push(arrayExpr);

      // Process spread elements
      for (const element of arrayExpr.getElements()) {
        if (element.getKind() !== SyntaxKind.SpreadElement) continue;

        const spreadElement = element as SpreadElement;
        const spreadExpr = spreadElement.getExpression();

        if (spreadExpr.getKind() === SyntaxKind.Identifier) {
          const referencedArray = this.resolveArrayReference(spreadExpr.getText());
          if (referencedArray) {
            arrays.push(referencedArray);
          }
        }
      }
    }
  }

  private resolveArrayReference(varName: string): ArrayLiteralExpression | null {
    // Try to find the variable in the current file
    const referencedVar = this.sourceFile.getVariableDeclaration(varName);
    if (referencedVar) {
      const arrayExpr = referencedVar.getInitializerIfKind(SyntaxKind.ArrayLiteralExpression);
      return arrayExpr || null;
    }

    // Try to find in imports
    const importDecl = this.sourceFile.getImportDeclaration((decl) => {
      return decl.getNamedImports().some((imp) => imp.getName() === varName);
    });

    if (importDecl) {
      const moduleSpecifier = importDecl.getModuleSpecifier().getText().replace(/['"]/g, '');
      const importedFile = this.project.getSourceFile(moduleSpecifier);
      if (importedFile) {
        const exportedVar = importedFile.getVariableDeclaration(varName);
        return exportedVar?.getInitializerIfKind(SyntaxKind.ArrayLiteralExpression) || null;
      }
    }

    return null;
  }

  private processNode(node: Node): void {
    // Prevent infinite recursion
    if (this.visitedNodes.has(node)) {
      return;
    }
    this.visitedNodes.add(node);

    // Process based on node type
    if (node.getKind() === SyntaxKind.ObjectLiteralExpression) {
      this.processObject(node as ObjectLiteralExpression);
    } else if (node.getKind() === SyntaxKind.ArrayLiteralExpression) {
      this.processArray(node as ArrayLiteralExpression);
    } else if (node.getKind() === SyntaxKind.Identifier) {
      // Resolve variable reference and process the resolved node
      const resolvedNode = this.resolveVariable(node);
      if (resolvedNode && !this.visitedNodes.has(resolvedNode)) {
        this.processNode(resolvedNode);
      }
    } else if (node.getKind() === SyntaxKind.StringLiteral) {
      this.checkForSecrets(node as StringLiteral);
    } else if (node.getKind() === SyntaxKind.SpreadElement) {
      const spreadExpr = (node as SpreadElement).getExpression();
      this.processNode(spreadExpr);
    }
  }

  private processObject(obj: ObjectLiteralExpression): void {
    // Check if this object contains an authorization header
    this.checkForAuthorizationHeader(obj);

    // Check if this object is a Config object with API keys
    this.checkForConfigApiKeys(obj);

    // Process all properties
    for (const prop of obj.getProperties()) {
      if (prop.getKind() !== SyntaxKind.PropertyAssignment) continue;

      const propAssignment = prop as PropertyAssignment;
      const initializer = propAssignment.getInitializer();

      if (initializer) {
        this.processNode(initializer);
      }
    }
  }

  private checkForAuthorizationHeader(obj: ObjectLiteralExpression): void {
    // Find the headers property
    const headersProp = obj.getProperty('headers');
    if (!headersProp || headersProp.getKind() !== SyntaxKind.PropertyAssignment) return;

    // Get the headers object
    const headersAssignment = headersProp as PropertyAssignment;
    const headersInitializer = headersAssignment.getInitializer();

    // Handle direct object or resolve variable
    let headersObj: ObjectLiteralExpression | null = null;

    if (headersInitializer?.getKind() === SyntaxKind.ObjectLiteralExpression) {
      headersObj = headersInitializer as ObjectLiteralExpression;
    } else if (headersInitializer?.getKind() === SyntaxKind.Identifier) {
      const resolved = this.resolveVariable(headersInitializer);
      if (resolved?.getKind() === SyntaxKind.ObjectLiteralExpression) {
        headersObj = resolved as ObjectLiteralExpression;
      }
    }

    if (!headersObj) return;

    // Look for Authorization property
    const authProp = headersObj.getProperty('Authorization');
    if (!authProp || authProp.getKind() !== SyntaxKind.PropertyAssignment) return;

    // Process the authorization header
    const authAssignment = authProp as PropertyAssignment;
    this.processAuthorizationHeader(authAssignment);
  }

  private processArray(array: ArrayLiteralExpression): void {
    const elements = array.getElements();
    console.log(`Processing array with ${elements.length} elements`);

    for (const element of elements) {
      this.processNode(element);
    }
  }

  private checkForSecrets(stringLiteral: StringLiteral): void {
    const literalValue = stringLiteral.getLiteralValue();

    // First check if this value appears as DUMMY_SECRET in the output
    const outputValue = this.findValueInOutput(literalValue);
    if (outputValue === VARIABLE_NAME) {
      // This is likely a secret that needs to be replaced
      this.replacements.set(literalValue, {
        type: 'Secret',
        value: literalValue,
        secrets: [literalValue],
        variableNames: [VARIABLE_NAME],
      });
      stringLiteral.replaceWithText(VARIABLE_NAME);
      console.log(
        `Found secret value that matches output pattern, replacing with ${VARIABLE_NAME}`,
      );
      return;
    }

    // Check against all found secrets
    for (const [key, replacement] of this.replacements.entries()) {
      // Handle multi-part secrets (Basic auth)
      for (let i = 0; i < replacement.secrets.length; i++) {
        const secret = replacement.secrets[i];
        const varName = replacement.variableNames[i];

        if (secret !== '' && literalValue === secret) {
          console.log(`Replacing secret in string literal with ${varName}`);
          stringLiteral.replaceWithText(`${varName}`);
          return; // Return after replacement to avoid multiple replacements
        }
      }
    }
  }

  private findValueInOutput(value: string): string | null {
    // Look for this value in the output section and see if it's replaced with DUMMY_SECRET
    const outputNodes = this.sourceFile
      .getDescendants()
      .filter(
        (node) =>
          node.getKind() === SyntaxKind.PropertyAssignment && node.getText().includes('output'),
      );

    for (const node of outputNodes) {
      const outputText = node.getText();
      if (outputText.includes(value) && outputText.includes(VARIABLE_NAME)) {
        return VARIABLE_NAME;
      }
    }
    return null;
  }

  private processAuthorizationHeader(headerPropAssignment: PropertyAssignment): void {
    const headerValue = headerPropAssignment.getInitializer()?.getText();
    if (!headerValue) return;

    const parsed = this.parseAuthorizationHeader(headerValue);
    if (!parsed) return;

    const { type, secrets } = parsed;
    const variableNames = this.generateVariableNames(type, secrets);

    // Store the replacement info for later use
    const key = type === AUTH_TYPES.BASIC ? secrets.join(':') : secrets[0];
    this.replacements.set(key, {
      type,
      value: headerValue,
      secrets,
      variableNames,
    });

    // Replace with appropriate template literal
    if (type === AUTH_TYPES.BASIC) {
      headerPropAssignment.setInitializer(
        `\`${type} \${basicEncoded(${variableNames[0]}, ${variableNames.length})}\``,
      );
    } else {
      headerPropAssignment.setInitializer(`\`${type} \${${variableNames[0]}}\``);
    }

    console.log(`Found ${type} auth with ${secrets.length} secret(s)`);
  }

  private parseAuthorizationHeader(headerValue: string): AuthHeaderInfo | null {
    if (!headerValue) return null;

    // Remove quotes from the string
    const cleanValue = headerValue.replace(/['"]/g, '');

    // Extract token based on common patterns
    if (cleanValue.startsWith(`${AUTH_TYPES.BEARER} `)) {
      const token = cleanValue.split(`${AUTH_TYPES.BEARER} `)[1].trim();
      return { type: AUTH_TYPES.BEARER, secrets: [token] };
    }

    if (cleanValue.startsWith(`${AUTH_TYPES.BASIC} `)) {
      try {
        const token = cleanValue.split(`${AUTH_TYPES.BASIC} `)[1].trim();
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        // For Basic auth, we might have username:password format
        const secrets = decoded.split(':');
        return { type: AUTH_TYPES.BASIC, secrets: secrets.filter((secret) => secret !== '') };
      } catch (e) {
        console.error('Error decoding Basic auth:', e);
        return null;
      }
    }

    if (cleanValue.startsWith(`${AUTH_TYPES.TOKEN} `)) {
      const token = cleanValue.split(`${AUTH_TYPES.TOKEN} `)[1].trim();
      const tokenKeyValue = token.split('=');
      return {
        type: AUTH_TYPES.TOKEN,
        secrets: [tokenKeyValue.length > 1 ? tokenKeyValue[1] : tokenKeyValue[0]],
      };
    }

    return null;
  }

  private generateVariableNames(type: string, secrets: string[]): string[] {
    // For simplicity, we'll use the same variable name for all secrets
    return secrets.map(() => VARIABLE_NAME);
  }

  private resolveVariable(node: Node): Node | null {
    if (node.getKind() !== SyntaxKind.Identifier) return null;

    // Try to find variable in current file
    const identifier = node.getText();
    const varDecl = this.sourceFile.getVariableDeclaration(identifier);

    if (varDecl) {
      return varDecl.getInitializer() || null;
    }

    // Try to find in imports
    const importDecl = this.sourceFile.getImportDeclaration((decl) => {
      return decl.getNamedImports().some((imp) => imp.getName() === identifier);
    });

    if (importDecl) {
      const moduleSpecifier = importDecl.getModuleSpecifier().getText().replace(/['"]/g, '');
      const importedFile = this.project.getSourceFile(moduleSpecifier);
      if (importedFile) {
        const exportedVar = importedFile.getVariableDeclaration(identifier);
        return exportedVar?.getInitializer() || null;
      }
    }

    return null;
  }

  private addRequiredImports(): void {
    const importDeclaration = this.sourceFile.getImportDeclaration(
      (decl) => decl.getModuleSpecifierValue() === this.relativeTestUtilsPath,
    );

    const needsEncodedFunction = Array.from(this.replacements.values()).some(
      (r) => r.type === AUTH_TYPES.BASIC,
    );

    if (importDeclaration) {
      const namedImports = importDeclaration.getNamedImports().map((imp) => imp.getName());
      if (!namedImports.includes(VARIABLE_NAME)) {
        importDeclaration.addNamedImport(VARIABLE_NAME);
      }
      if (needsEncodedFunction && !namedImports.includes('basicEncoded')) {
        importDeclaration.addNamedImport('basicEncoded');
      }
    } else {
      const namedImports = [VARIABLE_NAME];
      if (needsEncodedFunction) {
        namedImports.push('basicEncoded');
      }
      this.sourceFile.addImportDeclaration({
        namedImports,
        moduleSpecifier: this.relativeTestUtilsPath,
      });
    }
  }

  private saveChanges(): void {
    this.sourceFile.saveSync();
    console.log(
      `Updated ${this.sourceFile.getFilePath()} with ${this.replacements.size} replacements`,
    );
  }

  private logSummary(): void {
    console.log('\nVariable replacements:');
    for (const [key, replacement] of this.replacements.entries()) {
      const secretSummary =
        replacement.secrets.length > 1
          ? replacement.secrets
              .map((s, i) => `${s.substring(0, 3)}... → ${replacement.variableNames[i]}`)
              .join(', ')
          : `${replacement.secrets[0].substring(0, 3)}... → ${replacement.variableNames[0]}`;

      console.log(`- ${replacement.type}: ${secretSummary}`);
    }
  }
}

// File processing functions
function processDataFile(filePath: string) {
  console.log(`Processing ${filePath}...`);
  const processor = new SecretProcessor(filePath);
  processor.process();
}

function shouldProcessFile(filePath: string): boolean {
  // Skip files in dataDelivery folder
  return !filePath.includes('/dataDelivery/') && !filePath.includes('\\dataDelivery\\');
}

// Main execution
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

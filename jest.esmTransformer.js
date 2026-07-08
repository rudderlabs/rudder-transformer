// Jest transformer for ESM-only node_modules deps (e.g. uuid v14+).
// ts-jest refuses to compile files under node_modules, so we transpile
// ESM -> CommonJS directly with the TypeScript compiler.
const ts = require('typescript');

module.exports = {
  process(sourceText, sourcePath) {
    const { outputText } = ts.transpileModule(sourceText, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2021,
        allowJs: true,
        esModuleInterop: true,
      },
      fileName: sourcePath,
    });
    return { code: outputText };
  },
};

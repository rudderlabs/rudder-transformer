const parseStaticImports = require('parse-static-imports');

function parserForJSImports(code) {
  const obj = {};
  const modules = parseStaticImports(code);

  modules.forEach((mod) => {
    const { moduleName, defaultImport, namedImports } = mod;
    if (moduleName) {
      obj[moduleName] = [];

      if (defaultImport) {
        obj[moduleName].push(defaultImport);
      }

      namedImports.forEach((imp) => {
        obj[moduleName].push(imp.name);
      });
    }
  });
  return obj;
}

function parserForImport(code, language = 'javascript') {
  if (language !== 'javascript') {
    throw new Error(`Unsupported language ${language}`);
  }
  return parserForJSImports(code);
}

exports.parserForImport = parserForImport;

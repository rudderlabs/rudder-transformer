const parseStaticImports = require("parse-static-imports");

function parserForImport(code) {
  const obj = {};
  const modules = parseStaticImports(code);

  modules.forEach(mod => {
    const { moduleName } = mod;
    if (moduleName) {
      obj[moduleName] = [];

      if (mod.defaultImport) {
        obj[moduleName].push(mod.defaultImport);
      }

      mod.namedImports.forEach(imp => {
        obj[moduleName].push(imp.name);
      });
    }
  });
  return obj;
}

exports.parserForImport = parserForImport;

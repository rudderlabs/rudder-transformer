const axios = require('axios');
const parseStaticImports = require('parse-static-imports');
const { executeFaasFunction, FAAS_AST_VID, FAAS_AST_FN_NAME } = require('./openfaas');

async function parserForImport(code, validateImports=false, additionalLibraries=[], language="javascript") {
  switch(language) {
    case null:
    case undefined:
    case "javascript":
      return parserForJSImports(code);
    case "python":
    case "pythonfaas":
      return parserForPythonImports(code, validateImports, additionalLibraries);
    default:
      throw Error(`Unsupported language ${language}`);
  }
}

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

async function parserForPythonImports(code, validateImports=true, additionalLibraries=[]) {
  const obj = {};

  const payload = [{
    message: {
      messageId: "1",
      code,
      validateImports,
      additionalLibraries
    }
  }];

  const result = await executeFaasFunction(
    FAAS_AST_FN_NAME,
    payload,
    FAAS_AST_VID,
    [],
    false
  );

  const err = result.transformedEvents[0].error;

  if (err) {
    throw Error(err);
  }

  result.transformedEvents[0].transformedEvent.modules.forEach((mod) =>  obj[mod.name] = []);
  return obj;
}

exports.parserForImport = parserForImport;

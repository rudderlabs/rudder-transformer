const axios = require('axios');
const parseStaticImports = require('parse-static-imports');

const OPENFAAS_GATEWAY_URL = process.env.OPENFAAS_GATEWAY_URL || 'http://localhost:8080';

async function parserForImport(code, validateImports=true, language="javascript") {
  switch(language) {
    case "javascript":
      return parserForJSImports(code);
    case "python":
    case "pythonfaas":
      return parserForPythonImports(code, validateImports);
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

async function parserForPythonImports(code, validateImports=true, additionalLibs=[]) {
  const obj = {};

    const url = `${OPENFAAS_GATEWAY_URL}/function/fn-ast`;
    const payload = [{
      message: {
        messageId: "-",
        code,
        validateImports,
        additionalLibraries: additionalLibs
      }
    }];

    const response = await axios.post(
      url,
      payload,
      {validateStatus: () => true}
    );

    if (response.status !== 200) {
      throw Error(response.data.error || response.data.message);
    }

    response.data.transformedEvents[0].transformedEvent.modules.forEach((mod) => {
      obj[mod.name] = [];
    });


    return obj;
}

exports.parserForImport = parserForImport;
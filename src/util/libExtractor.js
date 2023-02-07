const { parserForImport } = require('./parser');

// param 'validateImports' supported for python/pythonfaas.
async function extractLibraries(code, validateImports, language = "javascript") {
    return parserForImport(code, validateImports, language);
}

exports.extractLibraries = extractLibraries;
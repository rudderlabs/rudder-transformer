const { parserForImport } = require('./parser');
const { getTransformationCodeV1 } = require('./customTransforrmationsStore-v1');

async function extractLibraries(code, versionId, language = "javascript") {
    if (language === "javascript") return parserForImport(code);

    let transformation;

    if (versionId && versionId !== "testVersionId") transformation = getTransformationCodeV1(versionId);

    if (transformation?.imports == null) {
        return parserForImport(code || transformation?.code, language);
    }

    return transformation.imports;
}

exports.extractLibraries = extractLibraries;

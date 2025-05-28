const ivm = require('isolated-vm');
const NodeCache = require('node-cache');
const parseStaticImports = require('parse-static-imports');
const { camelCase, isNil, isObject } = require('lodash');
const { createIvm, compileAndCacheModule, SHARE_ISOLATE } = require('./ivmFactory');

// TODO fetchWithDnsWrapper instead of fetch

// Cache for storing transformation code with a TTL of 24 hours
const transformationCache = new NodeCache({ stdTTL: 60 * 60 * 24 * 1 });
const libraryCache = new NodeCache({ stdTTL: 60 * 60 * 24 * 1 });
const rudderLibraryCache = new NodeCache({ stdTTL: 60 * 60 * 24 * 1 });

// Config backend URL for fetching transformations
const CONFIG_BACKEND_URL = process.env.CONFIG_BACKEND_URL || 'https://api.rudderlabs.com';
const getTransformationURL = `${CONFIG_BACKEND_URL}/transformation/getByVersionId`;
const getLibrariesUrl = `${CONFIG_BACKEND_URL}/transformationLibrary/getByVersionId`;
const getRudderLibrariesUrl = `${CONFIG_BACKEND_URL}/rudderstackTransformationLibraries`;
const userTransformTimeout = parseInt(process.env.USER_TRANSFORM_TIMEOUT || '600000', 10);
const ivmExecutionTimeout = parseInt(process.env.IVM_EXECUTION_TIMEOUT || '4000', 10);

// Regular expression for Rudder libraries
const RUDDER_LIBRARY_REGEX = /^@rs\/[A-Za-z]+\/v[0-9]{1,3}$/;

const SUPPORTED_FUNC_NAMES = ['transformEvent', 'transformBatch'];

// Function to extract stack trace up to the last substring match
const extractStackTraceUptoLastSubstringMatch = (trace, stringLiterals) => {
  const traceLines = trace.split('\n');
  let lastRelevantIndex = 0;

  for (let i = traceLines.length - 1; i >= 0; i -= 1) {
    if (stringLiterals.some((str) => traceLines[i].includes(str))) {
      lastRelevantIndex = i;
      break;
    }
  }

  return traceLines.slice(0, lastRelevantIndex + 1).join('\n');
};

// Error classes for handling response status
class RespStatusError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 400;
  }
}

class RetryRequestError extends RespStatusError {
  constructor(message) {
    // chosen random unique status code 809 to mark requests that needs to be retried
    super(message, 809);
  }
}

// Helper function to handle response status
const responseStatusHandler = (status, entity, id, url) => {
  if (status >= 500) {
    throw new RetryRequestError(`Error occurred while fetching ${entity} :: ${id}`);
  } else if (status !== 200) {
    throw new RespStatusError(`${entity} not found at ${url}`, status);
  }
};

const GEOLOCATION_TIMEOUT_IN_MS = parseInt(process.env.GEOLOCATION_TIMEOUT_IN_MS || '1000', 10);

/**
 * Run user transformation code in an isolated VM
 */
async function runUserTransform(
  events,
  code,
  secrets,
  eventsMetadata,
  transformationId,
  workspaceId,
  testMode = false,
  libraryVersionIDs = [],
  credentials = {},
) {
  // Create or retrieve an IVM instance with the code
  const ivmInstance = await createIvm(transformationId, code);
  const logs = [];

  // Extract libraries from code
  const extractedLibraries = Object.keys(extractLibraries(code));

  // Fetch libraries
  const libraries = await Promise.all(
    libraryVersionIDs.map(async (libraryVersionId) => await getLibraryCode(libraryVersionId)),
  );

  // Create a map of library names to library code
  const librariesMap = {};

  if (code && libraries) {
    // TODO what about extractLibraries?

    // Add regular libraries
    libraries.forEach((library) => {
      const libHandleName = camelCase(library.name);
      if (extractedLibraries.includes(libHandleName)) {
        librariesMap[libHandleName] = library.code;
      }
    });

    // Add Rudder libraries
    const rudderLibImportNames = extractedLibraries.filter((name) =>
      RUDDER_LIBRARY_REGEX.test(name),
    );

    const rudderLibraries = await Promise.all(
      rudderLibImportNames.map(async (importName) => await getRudderLibByImportName(importName)),
    );

    rudderLibraries.forEach((library) => {
      librariesMap[library.importName] = library.code;
    });
  }

  // Get references to IVM components
  const { isolate, context, jail } = ivmInstance;

  // Compile library modules
  ivmInstance.compiledModules = {};

  // TODO add caching so that if a module was already loaded we don't compile it again and just add it to the context
  await Promise.all(
    Object.entries(librariesMap).map(async ([moduleName, moduleCode]) => {
      ivmInstance.compiledModules[moduleName] = {
        module: await loadModule(isolate, context, moduleName, moduleCode),
      };
    }),
  );

  // This makes the global object available in the context as 'global'. We use 'derefInto()' here
  // because otherwise 'global' would actually be a Reference{} object in the new isolate.
  await jail.set('global', jail.derefInto());

  // The entire ivm module is transferable! We transfer the module to the new isolate so that we
  // have access to the library from within the isolate.
  await jail.set('_ivm', ivm);

  // Set up fetch in the isolate
  await jail.set(
    '_fetch',
    new ivm.Reference(async (resolve, ...args) => {
      try {
        // TODO use fetchWithDnsWrapper and fetchStartTime to measure fetch call duration
        const res = await fetch(...args);
        const data = await res.json();
        resolve.applyIgnored(undefined, [new ivm.ExternalCopy(data).copyInto()]);
      } catch (error) {
        resolve.applyIgnored(undefined, [new ivm.ExternalCopy('ERROR').copyInto()]);
      }
    }),
  );

  // Set up fetchV2 in the isolate (with more detailed response)
  await jail.set(
    '_fetchV2',
    new ivm.Reference(async (resolve, reject, ...args) => {
      try {
        // TODO use fetchWithDnsWrapper
        const fetchStartTime = new Date();
        const res = await fetch(...args);
        const headersContent = {};
        res.headers.forEach((value, header) => {
          headersContent[header] = value;
        });
        const data = {
          url: res.url,
          status: res.status,
          headers: headersContent,
          body: await res.text(),
        };

        try {
          data.body = JSON.parse(data.body);
        } catch (e) {}

        console.log(`FetchV2 call completed in ${new Date() - fetchStartTime}ms`);
        resolve.applyIgnored(undefined, [new ivm.ExternalCopy(data).copyInto()]);
      } catch (error) {
        const err = JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)));
        reject.applyIgnored(undefined, [new ivm.ExternalCopy(err).copyInto()]);
      }
    }),
  );

  // Set up geolocation in the isolate
  await jail.set(
    '_geolocation',
    new ivm.Reference(async (resolve, reject, ...args) => {
      try {
        const geoStartTime = new Date();
        if (args.length < 1) {
          throw new Error('ip address is required');
        }
        if (!process.env.GEOLOCATION_URL) throw new Error('geolocation is not available right now');

        const res = await fetch(`${process.env.GEOLOCATION_URL}/geoip/${args[0]}`, {
          timeout: GEOLOCATION_TIMEOUT_IN_MS,
        });
        if (res.status !== 200) {
          throw new Error(`request to fetch geolocation failed with status code: ${res.status}`);
        }
        const geoData = await res.json();
        console.log(`Geolocation call completed in ${new Date() - geoStartTime}ms`);
        resolve.applyIgnored(undefined, [new ivm.ExternalCopy(geoData).copyInto()]);
      } catch (error) {
        const err = JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)));
        reject.applyIgnored(undefined, [new ivm.ExternalCopy(err).copyInto()]);
      }
    }),
  );

  // Set up credentials in the isolate
  await jail.set('_getCredential', function (key) {
    if (isNil(credentials) || !isObject(credentials)) {
      console.error(
        `Error fetching credentials map for transformationID: ${transformationId} and workspaceId: ${workspaceId}`,
      );
      return undefined;
    }
    if (key === null || key === undefined) {
      throw new TypeError('Key should be valid and defined');
    }
    return credentials[key];
  });

  // Set up secrets in the isolate
  await jail.set('_rsSecrets', function (...args) {
    if (args.length == 0 || !secrets || !secrets[args[0]]) return 'ERROR';
    return secrets[args[0]];
  });

  // Set up logging in the isolate
  jail.setSync('log', function (...args) {
    // if (testMode) { // TODO
      let logString = 'Log:';
      args.forEach((arg) => {
        logString = logString.concat(` ${typeof arg === 'object' ? JSON.stringify(arg) : arg}`);
      });
      logs.push(logString);
    // }
  });

  // Set up extractStackTrace in the isolate
  await jail.set('extractStackTrace', function (trace, stringLiterals) {
    return extractStackTraceUptoLastSubstringMatch(trace, stringLiterals);
  });

  // Run the bootstrap script if not already run
  if (!ivmInstance.bootstrapScriptResult) {
    ivmInstance.bootstrapScriptResult = await ivmInstance.bootstrap.run(context);
  }

  // Check if we already have a compiled module
  if (!ivmInstance.customScriptModule) {
    // If not, compile and cache the module
    await compileAndCacheModule(transformationId, code, ivmInstance);

    // Instantiate the module with a handler for imports
    await ivmInstance.customScriptModule.instantiate(context, async (spec) => {
      if (librariesMap[spec]) {
        return ivmInstance.compiledModules[spec].module;
      }
      // Log the error but don't release the context here as it's managed by ivmFactory
      console.log(`Import from ${spec} failed. Module not found.`);
      throw new Error(`Import from ${spec} failed. Module not found.`);
    });
    await ivmInstance.customScriptModule.evaluate();
  }

  // Check if we already have the supported functions and transformWrapper reference
  if (!ivmInstance.supportedFuncs || Object.keys(ivmInstance.supportedFuncs).length === 0) {
    ivmInstance.supportedFuncs = {};
    await Promise.all(
      SUPPORTED_FUNC_NAMES.map(async (sName) => {
        const funcRef = await ivmInstance.customScriptModule.namespace.get(sName, {
          reference: true,
        });
        if (funcRef && funcRef.typeof === 'function') {
          ivmInstance.supportedFuncs[sName] = funcRef;
        }
      }),
    );
  }

  const availableFuncNames = Object.keys(ivmInstance.supportedFuncs);
  if (availableFuncNames.length !== 1) {
    throw new Error(
      `Expected one of ${SUPPORTED_FUNC_NAMES}. Found ${Object.values(availableFuncNames)}`,
    );
  }

  // Get the transformWrapper function from the module's namespace if not already available
  if (!ivmInstance.fnRef) {
    ivmInstance.fnRef = await ivmInstance.customScriptModule.namespace.get('transformWrapper', {
      reference: true,
    });
  }
  const fName = availableFuncNames[0];

  // Execute the user's code
  const transformationPayload = {};
  transformationPayload.events = events;
  transformationPayload.transformationType = fName;
  const executionPromise = new Promise(async (resolve, reject) => {
    const sharedTransformationPayload = new ivm.ExternalCopy(transformationPayload).copyInto({
      transferIn: true,
    });
    try {
      await ivmInstance.bootstrapScriptResult.apply(
        undefined,
        [ivmInstance.fnRef, new ivm.Reference(resolve), new ivm.Reference(reject), sharedTransformationPayload],
        { timeout: ivmExecutionTimeout },
      );
    } catch (error) {
      // Create an error object with both message and stack for better error reporting
      const errorInfo = {
        message: error.message,
        stack: error.stack || ''
      };
      reject(errorInfo);
    }
  });

  let result;
  const invokeTime = new Date();
  // Set a timeout for the execution
  let setTimeoutHandle;
  const timeoutPromise = new Promise((_, reject) => {
    setTimeoutHandle = setTimeout(() => {
      reject(new Error('Timed out'));
    }, userTransformTimeout);
  });

  try {
    result = await Promise.race([executionPromise, timeoutPromise]);
    if (result === 'Timed out') {
      throw new Error('Timed out');
    }
  } catch (error) {
    // Check if error is an object with message and stack properties
    if (error && typeof error === 'object' && error.message) {
      const errorMessage = error.message;
      const stackTrace = error.stack || '';
      console.error(`Transformation failed with error: ${errorMessage}`);
      console.log(`IVM Logs ${JSON.stringify(error, null, 2)}: ${logs}`);
      if (stackTrace) {
        console.error(`Stack trace: ${stackTrace}`);
      }
      // Create a new error with the message and stack trace
      const enhancedError = new Error(errorMessage);
      enhancedError.stack = stackTrace;
      throw enhancedError;
    } else {
      console.error(`Transformation failed with error: ${error}`);
      console.log(`IVM Logs ${JSON.stringify(error, null, 2)}: ${logs}`);
      throw error;
    }
  } finally {
    // Release timeout
    clearTimeout(setTimeoutHandle);

    // Note: We don't release IVM resources here if it's cached
    // The ivmFactory will handle resource cleanup when the cache expires

    // TODO use proper logger
    // console.log(`User transform function completed in ${new Date() - invokeTime}ms`);
    // console.log(`User transform function input events: ${events.length}`);
  }

  return {
    transformedEvents: result,
    logs,
  };
}

/**
 * Function to get transformation code from CONFIG_BACKEND_URL
 * Caches the transformation code by versionId
 */
async function getTransformationCode(versionId) {
  // TODO use proper logging
  // console.log(`Getting transformation code for version ${versionId}`);

  // Check if the transformation is in the cache
  const cachedTransformation = transformationCache.get(versionId);
  if (cachedTransformation) {
    // TODO use proper logging
    // console.log(`Using cached transformation for version ${versionId}`);
    return cachedTransformation;
  }

  try {
    // Fetch the transformation from CONFIG_BACKEND_URL
    const url = `${getTransformationURL}?versionId=${versionId}`;

    // TODO use proper logging
    // console.log(`Fetching transformation from ${url}`);

    // Use fetch with proxy if HTTPS_PROXY is set
    let fetchOptions = {};
    if (process.env.HTTPS_PROXY) {
      const HttpsProxyAgent = require('https-proxy-agent');
      fetchOptions.agent = new HttpsProxyAgent(process.env.HTTPS_PROXY);
    }

    const response = await fetch(url, fetchOptions);

    // Handle response status
    responseStatusHandler(response.status, 'Transformation', versionId, url);

    // Parse the response
    const transformation = await response.json();

    // Cache the transformation
    transformationCache.set(versionId, transformation);

    return transformation;
  } catch (error) {
    console.error(`Error fetching transformation code for versionId: ${versionId}`, error.message);
    throw error;
  }
}

/**
 * Handler for user transformations
 */
async function userTransformHandler(
  events,
  versionId,
  libraryVersionIDs,
  trRevCode = {},
  testMode = false,
  credentials = {}, // TODO
) {
  if (versionId) {
    const res = testMode ? trRevCode : await getTransformationCode(versionId);
    if (res) {
      // Extract messages from events
      const eventsMetadata = {};
      events.forEach((ev) => {
        // TODO why do we keep repeating this?
        eventsMetadata[ev.message.messageId] = ev.metadata;
      });

      // Extract credentials from events
      const credentialsMap = {};
      (events[0]?.credentials || []).forEach((cred) => {
        credentialsMap[cred.key] = cred.value;
      });

      // console.debug('Code:', testMode, res);

      try {
        // Run the transformation
        const result = await runUserTransform(
          events,
          res.code,
          res.secrets || {},
          eventsMetadata,
          res.id,
          res.workspaceId,
          testMode,
          libraryVersionIDs,
          credentialsMap,
        );

        // TODO check testMode throughout the whole "new" folder

        // Process the result
        return testMode
          ? result
          : result.transformedEvents.map((ev) => ({
              output: ev.transformedEvent,
              metadata: ev.metadata || eventsMetadata[ev.transformedEvent?.messageId] || {}, // TODO check if metadata is correct (e.g. commonMetadata?)
              statusCode: 200,
            }));
      } catch (error) {
        if (SHARE_ISOLATE && error.message === "Isolate is disposed") {
          // If using shared isolate and it's disposed, clear the global reference
          // so ivmFactory will create a new one on next call
          if (global.sharedIsolate) {
            delete global.sharedIsolate;
          }
          console.error("Shared isolate was disposed, will create a new one on next call");
        }

        // Enhanced error handling with stack trace
        console.error(`Error in userTransformHandler: ${error.message}`);
        if (error.stack) {
          console.error(`Stack trace: ${error.stack}`);
        }
        // Rethrow the error with enhanced information
        throw error;
      }
    }
  }

  // If no transformation is applied, return the original events
  return events;
}

/**
 * Load a module into the isolate
 * @param {Object} isolate - The isolate
 * @param {Object} context - The context
 * @param {string} moduleName - The name of the module
 * @param {string} moduleCode - The code of the module
 * @returns {Promise<Object>} - The compiled module
 */
async function loadModule(isolate, context, moduleName, moduleCode) {
  const module = await isolate.compileModule(moduleCode, {
    filename: `library ${moduleName}`,
  });
  await module.instantiate(context, () => {});
  return module;
}

/**
 * Parse static imports from JavaScript code
 * @param {string} code - The JavaScript code to parse
 * @returns {Object} - An object where keys are module names and values are arrays of imported names
 */
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

/**
 * Extract libraries from code
 * @param {string} code - The code to extract libraries from
 * @returns {Object} - An object where keys are module names and values are arrays of imported names
 */
function extractLibraries(code) {
  return parserForJSImports(code);
}

/**
 * Get library code by version ID
 * @param {string} versionId - The version ID of the library
 * @returns {Promise<Object>} - The library object
 */
async function getLibraryCode(versionId) {
  const library = libraryCache.get(versionId);
  if (library) return library;

  try {
    const url = `${getLibrariesUrl}?versionId=${versionId}`;

    // TODO use proper logging
    // console.log(`Fetching library from ${url}`);

    // Use fetch with proxy if HTTPS_PROXY is set
    let fetchOptions = {};
    if (process.env.HTTPS_PROXY) {
      const HttpsProxyAgent = require('https-proxy-agent');
      fetchOptions.agent = new HttpsProxyAgent(process.env.HTTPS_PROXY);
    }

    const response = await fetch(url, fetchOptions);

    responseStatusHandler(response.status, 'Transformation Library', versionId, url);
    const myJson = await response.json();
    libraryCache.set(versionId, myJson);
    return myJson;
  } catch (error) {
    console.error(`Error fetching library code for versionId: ${versionId}`, error.message);
    throw error;
  }
}

/**
 * Get Rudder library by import name
 * @param {string} importName - The import name of the Rudder library (e.g., "@rs/hash/v1")
 * @returns {Promise<Object>} - The Rudder library object
 */
async function getRudderLibByImportName(importName) {
  const rudderLibrary = rudderLibraryCache.get(importName);
  if (rudderLibrary) return rudderLibrary;

  try {
    const [name, version] = importName.split('/').slice(-2);
    const url = `${getRudderLibrariesUrl}/${name}?version=${version}`;

    // TODO use proper logging
    // console.log(`Fetching Rudder library from ${url}`);

    // Use fetch with proxy if HTTPS_PROXY is set
    let fetchOptions = {};
    if (process.env.HTTPS_PROXY) {
      const HttpsProxyAgent = require('https-proxy-agent');
      fetchOptions.agent = new HttpsProxyAgent(process.env.HTTPS_PROXY);
    }

    const response = await fetch(url, fetchOptions);

    responseStatusHandler(response.status, 'Rudder Library', importName, url);
    const myJson = await response.json();
    rudderLibraryCache.set(importName, myJson);
    return myJson;
  } catch (error) {
    console.error(
      `Error fetching rudder library code for importName: ${importName}`,
      error.message,
    );
    throw error;
  }
}

module.exports = {
  userTransformHandler,
  runUserTransform, // TODO check unused functions
  getTransformationCode,
  getLibraryCode,
  getRudderLibByImportName,
  extractLibraries,
  extractStackTraceUptoLastSubstringMatch,
  CONFIG_BACKEND_URL,
};

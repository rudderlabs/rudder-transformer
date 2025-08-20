const { isNil, isObject } = require('lodash');
const fetch = require('node-fetch');
const ivm = require('isolated-vm');
const logger = require('../logger');
const stats = require('./stats');
const { fetchWithDnsWrapper, extractStackTraceUptoLastSubstringMatch } = require('./utils');

/**
 * Shared IVM API injection utilities
 * Used by ivmFactory.js, contextReset.js, and customTransformer.js
 */

const GEOLOCATION_TIMEOUT_IN_MS = parseInt(process.env.GEOLOCATION_TIMEOUT_IN_MS || '1000', 10);

/**
 * Create API injection functions for IVM jail
 * @param {Object} params Configuration parameters
 * @param {string} params.transformationId Transformation ID for logging/stats
 * @param {string} params.workspaceId Workspace ID for logging/stats
 * @param {Object} params.credentials User credentials
 * @param {boolean} params.testMode Whether in test mode (for log function)
 * @param {Array} params.logs Log array (for test mode)
 * @returns {Object} API injection functions
 */
function createApiInjectors(params = {}) {
  const { transformationId, workspaceId, credentials = {}, testMode = false, logs = [] } = params;

  const trTags = {
    identifier: 'V1',
    transformationId,
    workspaceId,
  };

  return {
    /**
     * Inject _ivm module temporarily (deleted by bootstrap script)
     */
    async injectIvm(jail) {
      await jail.set('_ivm', ivm);
    },

    /**
     * Inject _fetch API for HTTP requests
     */
    async injectFetch(jail) {
      await jail.set(
        '_fetch',
        new ivm.Reference(async (resolve, ...args) => {
          const fetchStartTime = new Date();
          const fetchTags = { ...trTags };
          try {
            const res = await fetchWithDnsWrapper(trTags, ...args);
            const data = await res.json();
            fetchTags.isSuccess = 'true';
            resolve.applyIgnored(undefined, [new ivm.ExternalCopy(data).copyInto()]);
          } catch (error) {
            logger.debug('Error fetching data', error);
            fetchTags.isSuccess = 'false';
            resolve.applyIgnored(undefined, [new ivm.ExternalCopy('ERROR').copyInto()]);
          } finally {
            stats.timing('fetch_call_duration', fetchStartTime, fetchTags);
          }
        }),
      );
    },

    /**
     * Inject _fetchV2 API for advanced HTTP requests
     */
    async injectFetchV2(jail) {
      await jail.set(
        '_fetchV2',
        new ivm.Reference(async (resolve, reject, ...args) => {
          const fetchStartTime = new Date();
          const fetchTags = { ...trTags };
          try {
            const res = await fetchWithDnsWrapper(fetchTags, ...args);
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
            } catch (e) {
              logger.debug('Error parsing JSON', e);
            }
            fetchTags.isSuccess = 'true';
            resolve.applyIgnored(undefined, [new ivm.ExternalCopy(data).copyInto()]);
          } catch (error) {
            const err = JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)));
            logger.debug('Error fetching data in fetchV2', err);
            fetchTags.isSuccess = 'false';
            reject.applyIgnored(undefined, [new ivm.ExternalCopy(err).copyInto()]);
          } finally {
            stats.timing('fetchV2_call_duration', fetchStartTime, fetchTags);
          }
        }),
      );
    },

    /**
     * Inject _geolocation API for IP geolocation
     */
    async injectGeolocation(jail) {
      await jail.set(
        '_geolocation',
        new ivm.Reference(async (resolve, reject, ...args) => {
          const geoStartTime = new Date();
          const geoTags = { ...trTags };
          try {
            if (args.length === 0) {
              throw new Error('ip address is required');
            }
            if (!process.env.GEOLOCATION_URL)
              throw new Error('geolocation is not available right now');
            const res = await fetch(`${process.env.GEOLOCATION_URL}/geoip/${args[0]}`, {
              timeout: GEOLOCATION_TIMEOUT_IN_MS,
            });
            if (res.status !== 200) {
              throw new Error(
                `request to fetch geolocation failed with status code: ${res.status}`,
              );
            }
            const geoData = await res.json();
            geoTags.isSuccess = 'true';
            resolve.applyIgnored(undefined, [new ivm.ExternalCopy(geoData).copyInto()]);
          } catch (error) {
            const err = JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)));
            geoTags.isSuccess = 'false';
            reject.applyIgnored(undefined, [new ivm.ExternalCopy(err).copyInto()]);
          } finally {
            stats.timing('geo_call_duration', geoStartTime, geoTags);
          }
        }),
      );
    },

    /**
     * Inject _getCredential API for accessing user credentials
     */
    async injectGetCredential(jail) {
      await jail.set('_getCredential', function (key) {
        if (isNil(credentials) || !isObject(credentials)) {
          logger.error(
            `Error fetching credentials map for transformationID: ${transformationId} and workspaceId: ${workspaceId}`,
          );
          stats.increment('credential_error_total', trTags);
          return undefined;
        }
        if (key === null || key === undefined) {
          throw new TypeError('Key should be valid and defined');
        }
        return credentials[key];
      });
    },

    /**
     * Inject extractStackTrace utility function
     */
    async injectExtractStackTrace(jail) {
      await jail.set('extractStackTrace', function (trace, stringLiterals) {
        return extractStackTraceUptoLastSubstringMatch(trace, stringLiterals);
      });
    },

    /**
     * Inject log function (always available, but only logs in test mode)
     */
    async injectLog(jail) {
      // Always inject the log function, but make it conditional based on testMode
      await jail.set('log', function (...args) {
        if (testMode) {
          let logString = 'Log:';
          args.forEach((arg) => {
            logString = logString.concat(` ${typeof arg === 'object' ? JSON.stringify(arg) : arg}`);
          });
          logs.push(logString);
        }
        // In production mode (testMode = false), the function exists but does nothing
      });
    },

    /**
     * Inject all standard APIs at once
     */
    async injectAllApis(jail) {
      await this.injectIvm(jail);
      await this.injectFetch(jail);
      await this.injectFetchV2(jail);
      await this.injectGeolocation(jail);
      await this.injectGetCredential(jail);
      await this.injectExtractStackTrace(jail);
      await this.injectLog(jail);
    },
  };
}

/**
 * Create the standard bootstrap script that sets up the user environment
 * This script runs inside the isolate and creates safe wrapper functions
 * @param {Object} options Bootstrap options
 * @param {boolean} options.includeGetCredential Whether to include getCredential wrapper
 * @param {boolean} options.includeForwardMainPromise Whether to include forwardMainPromise function
 * @param {boolean} options.useV0ForwardMainPromise Whether to use V0 signature (3 params) vs V1 signature (4 params)
 * @returns {string} Bootstrap script code
 */
function createBootstrapScript(options = {}) {
  const {
    includeGetCredential = true,
    includeForwardMainPromise = true,
    useV0ForwardMainPromise = false,
  } = options;

  const getCredentialWrapper = includeGetCredential
    ? `
      let getCredential = _getCredential;
      delete _getCredential;
      global.getCredential = function(...args) {
        const key = args[0];
        return getCredential(new ivm.ExternalCopy(key).copyInto());
      };`
    : '';

  const forwardMainPromiseFunction = includeForwardMainPromise
    ? useV0ForwardMainPromise
      ? `
        return new ivm.Reference(function forwardMainPromise(
          fnRef,
          resolve,
          events
          ) {
            const derefMainFunc = fnRef.deref();
            Promise.resolve(derefMainFunc(events))
            .then(value => {
              resolve.applyIgnored(undefined, [
                new ivm.ExternalCopy(value).copyInto()
              ]);
            })
            .catch(error => {
              resolve.applyIgnored(undefined, [
                new ivm.ExternalCopy(error.message).copyInto()
              ]);
            });
          });`
      : `
        return new ivm.Reference(function forwardMainPromise(
          fnRef,
          resolve,
          reject,
          events
          ){
            const derefMainFunc = fnRef.deref();
            Promise.resolve(derefMainFunc(events))
            .then(value => {
              resolve.applyIgnored(undefined, [
                new ivm.ExternalCopy(value).copyInto()
              ]);
            })
            .catch(error => {
              reject.applyIgnored(undefined, [
                new ivm.ExternalCopy(error.message).copyInto()
              ]);
            });
          });`
    : '';

  return `new function() {
      // Grab a reference to the ivm module and delete it from global scope. Now this closure is the
      // only place in the context with a reference to the module. The 'ivm' module is very powerful
      // so you should not put it in the hands of untrusted code.
      let ivm = _ivm;
      delete _ivm;

      // Now we create the other half of the API functions in this isolate. We'll take every
      // argument, create an external copy of it and pass it along to the API function.
      let fetch = _fetch;
      delete _fetch;
      global.fetch = function(...args) {
        // We use 'copyInto()' here so that on the other side we don't have to call 'copy()'. It
        // doesn't make a difference who requests the copy, the result is the same.
        // 'applyIgnored' calls the function asynchronously but doesn't return a promise-- it ignores the
        // return value or thrown exception.
        return new Promise(resolve => {
          fetch.applyIgnored(undefined, [
            new ivm.Reference(resolve),
            ...args.map(arg => new ivm.ExternalCopy(arg).copyInto())
          ]);
        });
      };

      let fetchV2 = _fetchV2;
      delete _fetchV2;
      global.fetchV2 = function(...args) {
        return new Promise((resolve, reject) => {
          fetchV2.applyIgnored(undefined, [
            new ivm.Reference(resolve),
            new ivm.Reference(reject),
            ...args.map(arg => new ivm.ExternalCopy(arg).copyInto())
          ]);
        });
      };

      let geolocation = _geolocation;
      delete _geolocation;
      global.geolocation = function(...args) {
        return new Promise((resolve, reject) => {
          geolocation.applyIgnored(undefined, [
            new ivm.Reference(resolve),
            new ivm.Reference(reject),
            ...args.map(arg => new ivm.ExternalCopy(arg).copyInto())
          ]);
        });
      };
      ${getCredentialWrapper}
      ${forwardMainPromiseFunction}
    }`;
}

/**
 * Setup a complete IVM jail with all standard APIs
 * @param {Object} jail The IVM context jail
 * @param {Object} params Configuration parameters
 * @returns {Promise<void>}
 */
async function setupJailWithApis(jail, params = {}) {
  // Set up global object properly
  await jail.set('global', jail.derefInto());

  // Inject all APIs
  const apiInjector = createApiInjectors(params);
  await apiInjector.injectAllApis(jail);
}

/**
 * Compile and run bootstrap script in the given context
 * @param {Object} isolate The IVM isolate
 * @param {Object} context The IVM context
 * @param {Object} options Bootstrap options
 * @returns {Promise<Object>} Bootstrap script result
 */
async function compileAndRunBootstrap(isolate, context, options = {}) {
  const bootstrapScript = createBootstrapScript(options);
  const bootstrap = await isolate.compileScript(bootstrapScript);
  const bootstrapScriptResult = await bootstrap.run(context);
  return { bootstrap, bootstrapScriptResult };
}

module.exports = {
  createApiInjectors,
  createBootstrapScript,
  setupJailWithApis,
  compileAndRunBootstrap,
  GEOLOCATION_TIMEOUT_IN_MS,
};

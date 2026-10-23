const ivm = require('isolated-vm');
const fetch = require('node-fetch');
const { isNil, isObject } = require('lodash');
const logger = require('../logger');
const stats = require('./stats');
const {
  validateIp,
  fetchWithDnsWrapper,
  extractStackTraceUptoLastSubstringMatch,
} = require('./utils');

const GEOLOCATION_TIMEOUT_IN_MS = Number.parseInt(
  process.env.GEOLOCATION_TIMEOUT_IN_MS || '1000',
  10,
);

/**
 * Inject the host APIs that V1 user transformations use into an isolate context.
 * Both fresh isolates (ivmFactory) and cached-isolate context resets call this, so the
 * two paths always expose the same globals.
 * @param {Object} jail The context global
 * @param {Object} options
 * @param {Object} options.trTags Stats tags; must include transformationId and workspaceId
 * @param {Object} options.credentials Credentials map for getCredential
 * @param {boolean} [options.testMode] Capture log() calls into options.logs
 * @param {Array<string>} [options.logs] Log sink used in test mode
 */
async function injectSandboxApis(jail, { trTags, credentials, testMode = false, logs = [] }) {
  // The entire ivm module is transferable! We transfer the module to the new isolate so that we
  // have access to the library from within the isolate.
  await jail.set('_ivm', ivm);
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

  await jail.set(
    '_fetchV2',
    new ivm.Reference(async (resolve, reject, ...args) => {
      const fetchStartTime = new Date();
      const fetchTags = { ...trTags };
      try {
        const res = await fetchWithDnsWrapper(fetchTags, ...args);
        const headersContent = {};
        for (const [header, value] of res.headers) {
          headersContent[header] = value;
        }
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

  await jail.set(
    '_geolocation',
    new ivm.Reference(async (resolve, reject, ...args) => {
      const geoStartTime = new Date();
      const geoTags = { ...trTags };
      try {
        validateIp(args[0]);
        if (!process.env.GEOLOCATION_URL) throw new Error('geolocation is not available right now');
        const res = await fetch(`${process.env.GEOLOCATION_URL}/geoip/${args[0]}`, {
          timeout: GEOLOCATION_TIMEOUT_IN_MS,
        });
        if (res.status !== 200) {
          throw new Error(`request to fetch geolocation failed with status code: ${res.status}`);
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

  await jail.set('_getCredential', function (key) {
    if (isNil(credentials) || !isObject(credentials)) {
      logger.error(
        `Error fetching credentials map for transformationID: ${trTags.transformationId} and workspaceId: ${trTags.workspaceId}`,
      );
      stats.increment('credential_error_total', trTags);
      return undefined;
    }
    if (key === null || key === undefined) {
      throw new TypeError('Key should be valid and defined');
    }
    return credentials[key];
  });

  // Outside test mode the bootstrap script defines a no-op 'log' inside the isolate.
  if (testMode) {
    await jail.set('log', function (...args) {
      let logString = 'Log:';
      for (const arg of args) {
        logString = logString.concat(` ${typeof arg === 'object' ? JSON.stringify(arg) : arg}`);
      }
      logs.push(logString);
    });
  }

  await jail.set('extractStackTrace', function (trace, stringLiterals) {
    return extractStackTraceUptoLastSubstringMatch(trace, stringLiterals);
  });
}

module.exports = { injectSandboxApis };

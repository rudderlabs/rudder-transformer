// Shared utility for ivm isolate/context/global setup
const ivm = require('isolated-vm');
const fetch = require('node-fetch');
const stats = require('./stats');
const logger = require('../logger');
const { fetchWithDnsWrapper } = require('./utils');

const ISOLATE_VM_MEMORY = parseInt(process.env.ISOLATE_VM_MEMORY || '128', 10);
const GEOLOCATION_TIMEOUT_IN_MS = parseInt(process.env.GEOLOCATION_TIMEOUT_IN_MS || '1000', 10);

/**
 * Create an ivm isolate and context, register globals, and return references.
 * @param {Object} options - { trTags, testMode, credentials, withCredential, withMetadata, withModules }
 * @returns {Object} { isolate, context, jail }
 */
async function createIsolateContext({
  trTags = {},
  testMode = false,
  credentials = null,
  withCredential = false,
  withMetadata = false,
} = {}) {
  const isolate = new ivm.Isolate({ memoryLimit: ISOLATE_VM_MEMORY });
  const context = await isolate.createContext();
  const jail = context.global;
  await jail.set('global', jail.derefInto());
  await jail.set('_ivm', ivm);

  await jail.set(
    '_fetch',
    new ivm.Reference(async (resolve, ...args) => {
      try {
        const fetchStartTime = new Date();
        const res = await fetchWithDnsWrapper(trTags, ...args);
        const data = await res.json();
        stats.timing('fetch_call_duration', fetchStartTime, trTags);
        resolve.applyIgnored(undefined, [new ivm.ExternalCopy(data).copyInto()]);
      } catch (error) {
        resolve.applyIgnored(undefined, [new ivm.ExternalCopy('ERROR').copyInto()]);
        logger.debug('Error fetching data', error);
      }
    }),
  );

  await jail.set(
    '_fetchV2',
    new ivm.Reference(async (resolve, reject, ...args) => {
      try {
        const fetchStartTime = new Date();
        const res = await fetchWithDnsWrapper(trTags, ...args);
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
        stats.timing('fetchV2_call_duration', fetchStartTime, trTags);
        resolve.applyIgnored(undefined, [new ivm.ExternalCopy(data).copyInto()]);
      } catch (error) {
        const err = JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)));
        reject.applyIgnored(undefined, [new ivm.ExternalCopy(err).copyInto()]);
      }
    }),
  );

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
        stats.timing('geo_call_duration', geoStartTime, trTags);
        resolve.applyIgnored(undefined, [new ivm.ExternalCopy(geoData).copyInto()]);
      } catch (error) {
        const err = JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)));
        reject.applyIgnored(undefined, [new ivm.ExternalCopy(err).copyInto()]);
      }
    }),
  );

  if (withCredential) {
    await jail.set('_getCredential', function (key) {
      if (!credentials || typeof credentials !== 'object') {
        logger.error('Error fetching credentials map', trTags);
        stats.increment('credential_error_total', trTags);
        return undefined;
      }
      if (key === null || key === undefined) {
        throw new TypeError('Key should be valid and defined');
      }
      return credentials[key];
    });
  }

  if (testMode) {
    await jail.set('log', function (...args) {
      let logString = 'Log:';
      args.forEach((arg) => {
        logString = logString.concat(` ${typeof arg === 'object' ? JSON.stringify(arg) : arg}`);
      });
      if (this.logs) this.logs.push(logString);
    });
  }

  if (withMetadata) {
    await jail.set('metadata', function (...args) {
      // expects eventsMetadata to be in closure scope
      const eventMetadata = this.eventsMetadata ? this.eventsMetadata[args[0].messageId] || {} : {};
      const meta = { ...eventMetadata };
      return new ivm.ExternalCopy(meta).copyInto();
    });
  }

  return { isolate, context, jail };
}

/**
 * Run a bootstrap script in the context and return the result reference.
 * @param {ivm.Context} context
 * @param {string} scriptSource
 * @returns {ivm.Reference}
 */
async function runBootstrapScript(context, scriptSource) {
  const bootstrap = await context.isolate.compileScript(scriptSource);
  return bootstrap.run(context);
}

/**
 * Cleanup all ivm resources.
 * @param {Object} resources - { fnRef, customScript, bootstrapScriptResult, context, isolate }
 */
function cleanupIsolateResources({ fnRef, customScript, bootstrapScriptResult, context, isolate }) {
  if (fnRef) fnRef.release();
  if (customScript) customScript.release();
  if (bootstrapScriptResult) bootstrapScriptResult.release();
  if (context) context.release();
  if (isolate) isolate.dispose();
}

module.exports = {
  createIsolateContext,
  runBootstrapScript,
  cleanupIsolateResources,
};

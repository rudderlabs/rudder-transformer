const ivm = require('isolated-vm');
const { isNil, isObject } = require('lodash');
const fetch = require('node-fetch');

const logger = require('../../logger');
const stats = require('../stats');
const {
  extractStackTraceUptoLastSubstringMatch,
  fetchWithDnsWrapper,
  validateIp,
} = require('../utils');

const serializeError = (error) =>
  JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)));

const getGeolocationTimeoutInMs = () =>
  Number.parseInt(process.env.GEOLOCATION_TIMEOUT_IN_MS || '1000', 10);

const getGeolocationUrl = () => process.env.GEOLOCATION_URL;

const createFetchReference = (trTags) =>
  new ivm.Reference(async (...args) => {
    const fetchStartTime = new Date();
    const fetchTags = { ...trTags };
    try {
      const res = await fetchWithDnsWrapper(trTags, ...args);
      const data = await res.json();
      fetchTags.isSuccess = 'true';
      return data;
    } catch (error) {
      fetchTags.isSuccess = 'false';
      logger.debug('Error fetching data', error);
      return 'ERROR';
    } finally {
      stats.timing('fetch_call_duration', fetchStartTime, fetchTags);
    }
  });

const createFetchV2Reference = (trTags) =>
  new ivm.Reference(async (...args) => {
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
      return { value: data };
    } catch (error) {
      const err = serializeError(error);
      logger.debug('Error fetching data in fetchV2', err);
      fetchTags.isSuccess = 'false';
      return { error: err };
    } finally {
      stats.timing('fetchV2_call_duration', fetchStartTime, fetchTags);
    }
  });

const createGeolocationReference = (trTags) =>
  new ivm.Reference(async (...args) => {
    const geoStartTime = new Date();
    const geoTags = { ...trTags };
    try {
      validateIp(args[0]);
      if (!getGeolocationUrl()) throw new Error('geolocation is not available right now');
      const res = await fetch(`${getGeolocationUrl()}/geoip/${args[0]}`, {
        timeout: getGeolocationTimeoutInMs(),
      });
      if (res.status !== 200) {
        throw new Error(`request to fetch geolocation failed with status code: ${res.status}`);
      }
      const geoData = await res.json();
      geoTags.isSuccess = 'true';
      return { value: geoData };
    } catch (error) {
      geoTags.isSuccess = 'false';
      return { error: serializeError(error) };
    } finally {
      stats.timing('geo_call_duration', geoStartTime, geoTags);
    }
  });

const createLogReference = (logs, testMode) =>
  new ivm.Reference((...args) => {
    if (testMode) {
      let logString = 'Log:';
      for (const arg of args) {
        logString = logString.concat(` ${typeof arg === 'object' ? JSON.stringify(arg) : arg}`);
      }
      (logs || []).push(logString);
    }
  });

const createGetCredentialReference = ({ credentials, trTags, transformationId, workspaceId }) =>
  new ivm.Reference((key) => {
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

const createExtractStackTraceReference = () =>
  new ivm.Reference((trace, stringLiterals) =>
    extractStackTraceUptoLastSubstringMatch(trace, stringLiterals),
  );

const createMetadataReference = (eventsMetadata) =>
  new ivm.Reference((event = {}) => {
    const eventMetadata = eventsMetadata[event.messageId] || {};
    return {
      sourceId: eventMetadata.sourceId,
      sourceName: eventMetadata.sourceName,
      originalSourceId: eventMetadata.originalSourceId,
      workspaceId: eventMetadata.workspaceId,
      sourceType: eventMetadata.sourceType,
      sourceCategory: eventMetadata.sourceCategory,
      destinationId: eventMetadata.destinationId,
      destinationType: eventMetadata.destinationType,
      destinationName: eventMetadata.destinationName,
      namespace: eventMetadata.namespace,
      trackingPlanId: eventMetadata.trackingPlanId,
      trackingPlanVersion: eventMetadata.trackingPlanVersion,
      sourceTpConfig: eventMetadata.sourceTpConfig,
      mergedTpConfig: eventMetadata.mergedTpConfig,
      jobId: eventMetadata.jobId,
      sourceJobId: eventMetadata.sourceJobId,
      sourceJobRunId: eventMetadata.sourceJobRunId,
      sourceTaskRunId: eventMetadata.sourceTaskRunId,
      recordId: eventMetadata.recordId,
      messageId: eventMetadata.messageId,
      messageIds: eventMetadata.messageIds,
      rudderId: eventMetadata.rudderId,
      receivedAt: eventMetadata.receivedAt,
      eventName: eventMetadata.eventName,
      eventType: eventMetadata.eventType,
      sourceDefinitionId: eventMetadata.sourceDefinitionId,
      destinationDefinitionId: eventMetadata.destinationDefinitionId,
      transformationId: eventMetadata.transformationId,
      transformationVersionId: eventMetadata.transformationVersionId,
    };
  });

async function injectV0SandboxApis({ jail, trTags, logs, testMode, eventsMetadata }) {
  await jail.set('_fetchRef', createFetchReference(trTags));
  await jail.set('_fetchV2Ref', createFetchV2Reference(trTags));
  await jail.set('_geolocationRef', createGeolocationReference(trTags));
  await jail.set('_logRef', createLogReference(logs, testMode));
  await jail.set('_metadataRef', createMetadataReference(eventsMetadata));
}

async function injectV1SandboxApis({
  jail,
  trTags,
  logs,
  testMode,
  credentials,
  transformationId,
  workspaceId,
}) {
  await jail.set('_fetchRef', createFetchReference(trTags));
  await jail.set('_fetchV2Ref', createFetchV2Reference(trTags));
  await jail.set('_geolocationRef', createGeolocationReference(trTags));
  await jail.set(
    '_getCredentialRef',
    createGetCredentialReference({ credentials, trTags, transformationId, workspaceId }),
  );
  await jail.set('_logRef', createLogReference(logs, testMode));
  await jail.set('_extractStackTraceRef', createExtractStackTraceReference());
}

const SANDBOX_API_BOOTSTRAP_SOURCE = `
  var fetchRef = _fetchRef;
  var fetchV2Ref = _fetchV2Ref;
  var geolocationRef = _geolocationRef;
  var logRef = _logRef;
  var metadataRef = typeof _metadataRef === 'undefined' ? undefined : _metadataRef;
  delete _fetchRef;
  delete _fetchV2Ref;
  delete _geolocationRef;
  delete _logRef;
  delete _metadataRef;

  function unwrapHostResult(result) {
    if (result && result.error) {
      throw result.error;
    }
    return result ? result.value : result;
  }

  global.fetch = (...args) =>
    fetchRef.apply(undefined, args, {
      arguments: { copy: true },
      result: { copy: true, promise: true },
    });
  global.fetchV2 = async (...args) => {
    var result = await fetchV2Ref.apply(undefined, args, {
      arguments: { copy: true },
      result: { copy: true, promise: true },
    });
    return unwrapHostResult(result);
  };
  global.geolocation = async (...args) => {
    var result = await geolocationRef.apply(undefined, args, {
      arguments: { copy: true },
      result: { copy: true, promise: true },
    });
    return unwrapHostResult(result);
  };
  global.log = (...args) =>
    logRef.applyIgnored(undefined, args, {
      arguments: { copy: true },
    });
  if (metadataRef) {
    global.metadata = (...args) =>
      metadataRef.applySync(undefined, args, {
        arguments: { copy: true },
        result: { copy: true },
      });
  }
`;

const V1_SANDBOX_API_BOOTSTRAP_SOURCE = `
  ${SANDBOX_API_BOOTSTRAP_SOURCE}
  var getCredentialRef = _getCredentialRef;
  var extractStackTraceRef = _extractStackTraceRef;
  delete _getCredentialRef;
  delete _extractStackTraceRef;

  global.getCredential = (...args) =>
    getCredentialRef.applySync(undefined, args, {
      arguments: { copy: true },
      result: { copy: true },
    });
  global.extractStackTrace = (...args) =>
    extractStackTraceRef.applySync(undefined, args, {
      arguments: { copy: true },
      result: { copy: true },
    });
`;

const V0_FORWARD_MAIN_PROMISE_SOURCE = `
  (() => {
    ${SANDBOX_API_BOOTSTRAP_SOURCE}

    function forwardMainPromise(fnRef, resolve, events) {
      const derefMainFunc = fnRef.deref();
      Promise.resolve(derefMainFunc(events))
        .then(value => {
          resolve.applyIgnored(undefined, [value], { arguments: { copy: true } });
        })
        .catch(error => {
          resolve.applyIgnored(undefined, [error.message], { arguments: { copy: true } });
        });
    }
    return forwardMainPromise;
  })();
`;

const V1_FORWARD_MAIN_PROMISE_SOURCE = `
  (() => {
    ${V1_SANDBOX_API_BOOTSTRAP_SOURCE}

    function forwardMainPromise(fnRef, resolve, reject, events) {
      const derefMainFunc = fnRef.deref();
      Promise.resolve(derefMainFunc(events))
        .then(value => {
          resolve.applyIgnored(undefined, [value], { arguments: { copy: true } });
        })
        .catch(error => {
          reject.applyIgnored(undefined, [error.message], { arguments: { copy: true } });
        });
    }
    return forwardMainPromise;
  })();
`;

module.exports = {
  injectV0SandboxApis,
  injectV1SandboxApis,
  V0_FORWARD_MAIN_PROMISE_SOURCE,
  V1_FORWARD_MAIN_PROMISE_SOURCE,
};

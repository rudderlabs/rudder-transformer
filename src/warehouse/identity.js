const _ = require('lodash');
const { InstrumentationError } = require('../v0/util/errorTypes');
const { getVersionedUtils } = require('./util');

const identityEnabledWarehouses = ['snowflake', 'bq'];
const versionedMergePropColumns = {};
const versionedMergeRuleTableNames = {};

// Computes provider-safe column name
// Caches for future use
function getMergePropColumns(version, options) {
  const { provider } = options;
  if (
    versionedMergePropColumns[version] !== undefined &&
    versionedMergePropColumns[version][provider] !== undefined
  ) {
    return versionedMergePropColumns[version][provider];
  }

  if (versionedMergePropColumns[version] === undefined) {
    versionedMergePropColumns[version] = {};
  }

  const utils = getVersionedUtils(version);
  versionedMergePropColumns[version][provider] = {
    prop1Type: utils.safeColumnName(options, 'merge_property_1_type'),
    prop1Value: utils.safeColumnName(options, 'merge_property_1_value'),
    prop2Type: utils.safeColumnName(options, 'merge_property_2_type'),
    prop2Value: utils.safeColumnName(options, 'merge_property_2_value'),
  };
  return versionedMergePropColumns[version][provider];
}

// Computes provider-safe Table name
// Caches for future use
function getMergeRulesTableName(version, options) {
  const { provider } = options;
  if (
    versionedMergeRuleTableNames[version] !== undefined &&
    versionedMergeRuleTableNames[version][provider] !== undefined
  ) {
    return versionedMergeRuleTableNames[version][provider];
  }

  if (versionedMergeRuleTableNames[version] === undefined) {
    versionedMergeRuleTableNames[version] = {};
  }
  const utils = getVersionedUtils(version);
  versionedMergeRuleTableNames[version][provider] = utils.safeTableName(
    options,
    'rudder_identity_merge_rules',
  );
  return versionedMergeRuleTableNames[version][provider];
}

// Get Merge rule event from any given event
function getMergeRuleEvent(message = {}, eventType, options) {
  const { whSchemaVersion, provider, whIDResolve } = options;
  if (!whIDResolve) {
    return null;
  }

  if (!identityEnabledWarehouses.includes(provider)) {
    return null;
  }
  let mergeProp1 = {};
  let mergeProp2 = {};
  if (eventType === 'merge') {
    if (!_.has(message, 'mergeProperties[0]') || !_.has(message, 'mergeProperties[1]')) {
      throw new InstrumentationError('either or both identifiers missing in mergeProperties');
    }

    if (
      _.isEmpty(_.toString(message.mergeProperties[0].type)) ||
      _.isEmpty(_.toString(message.mergeProperties[0].value)) ||
      _.isEmpty(_.toString(message.mergeProperties[1].type)) ||
      _.isEmpty(_.toString(message.mergeProperties[1].value))
    ) {
      throw new InstrumentationError('mergeProperties contains null values for expected inputs');
    }

    mergeProp1 = {
      name: message.mergeProperties[0].type,
      value: message.mergeProperties[0].value,
    };
    mergeProp2 = {
      name: message.mergeProperties[1].type,
      value: message.mergeProperties[1].value,
    };
  } else if (eventType === 'alias') {
    mergeProp1 = { name: 'user_id', value: message.userId };
    mergeProp2 = { name: 'user_id', value: message.previousId };
  } else if (_.isEmpty(_.toString(message.anonymousId))) {
    // handle messages with only userId and no anonymousId
    mergeProp1 = { name: 'user_id', value: message.userId };
  } else {
    mergeProp1 = { name: 'anonymous_id', value: message.anonymousId };
    mergeProp2 = { name: 'user_id', value: message.userId };
  }

  if (_.isEmpty(_.toString(mergeProp1.value))) {
    return null;
  }

  const mergePropColumns = getMergePropColumns(whSchemaVersion, options);

  // add prop1 to merge rule
  const mergeRule = {
    [mergePropColumns.prop1Type]: mergeProp1.name,
    [mergePropColumns.prop1Value]: mergeProp1.value.toString(),
  };
  const mergeColumnTypes = {
    [mergePropColumns.prop1Type]: 'string',
    [mergePropColumns.prop1Value]: 'string',
  };

  // add prop2 to merge rule
  if (!_.isEmpty(_.toString(mergeProp2.value))) {
    mergeRule[mergePropColumns.prop2Type] = mergeProp2.name;
    mergeRule[mergePropColumns.prop2Value] = mergeProp2.value.toString();
    mergeColumnTypes[mergePropColumns.prop2Type] = 'string';
    mergeColumnTypes[mergePropColumns.prop2Value] = 'string';
  }

  const mergeRulesMetadata = {
    table: getMergeRulesTableName(whSchemaVersion, options),
    columns: mergeColumnTypes,
    isMergeRule: true,
    receivedAt: message.receivedAt,
    mergePropOne: mergeProp1.value.toString(),
    mergePropTwo: mergeProp2.value && mergeProp2.value.toString(),
  };
  return { metadata: mergeRulesMetadata, data: mergeRule };
}

module.exports = {
  getMergeRuleEvent,
};

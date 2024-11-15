const { getMappingConfig } = require('../../util');

const destType = 'INTERCOM_V2';

const ApiVersions = {
  v2: '2.10',
};

const RecordAction = {
  INSERT: 'insert',
  UPDATE: 'update',
  DELETE: 'delete',
};

const ConfigCategory = {
  IDENTIFY: {
    name: 'IntercomIdentifyConfig',
  },
  TRACK: {
    name: 'IntercomTrackConfig',
  },
  GROUP: {
    name: 'IntercomGroupConfig',
  },
};

const MappingConfig = getMappingConfig(ConfigCategory, __dirname);

module.exports = {
  destType,
  ConfigCategory,
  MappingConfig,
  ApiVersions,
  RecordAction,
};

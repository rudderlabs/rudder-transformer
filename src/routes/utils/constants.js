const SUPPORTED_VERSIONS = ['v0'];
const API_VERSION = '2';
const INTEGRATION_SERVICE = {
  COMPARATOR: 'comparator',
  CDK_V1_DEST: 'cdkv1_dest',
  CDK_V2_DEST: 'cdkv2_dest',
  NATIVE_DEST: 'native_dest',
  NATIVE_SOURCE: 'native_source',
};
const CHANNELS= {
  sources: 'sources'
};

const RETL_TIMESTAMP = 'timestamp';

module.exports = { SUPPORTED_VERSIONS, API_VERSION, INTEGRATION_SERVICE, CHANNELS, RETL_TIMESTAMP };

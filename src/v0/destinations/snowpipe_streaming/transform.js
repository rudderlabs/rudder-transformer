const {
  process: snowflakeProcess,
  provider: snowflakeProvider,
  getDataTypeOverride: snowflakeGetDataTypeOverride,
} = require('../snowflake/transform');

module.exports = {
  provider: snowflakeProvider,
  process: snowflakeProcess,
  getDataTypeOverride: snowflakeGetDataTypeOverride,
};

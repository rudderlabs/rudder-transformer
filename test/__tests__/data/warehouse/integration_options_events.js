const _ = require("lodash");
const {identifiesConfig} = require("./sample-events/identifies");
const {tracksConfig} = require("./sample-events/tracks");
const {screensConfig} = require("./sample-events/screens");
const {pagesConfig} = require("./sample-events/pages");
const {aliasesConfig} = require("./sample-events/aliases");
const {groupsConfig} = require("./sample-events/groups");
/*
 * RS: skip tracks, skip escaping, use blendo
 *    no tracks
 *    no escaping on reserved keyword groups
 *    path to $1,000,000 -> path_to_$1_000_000; 9omega -> _9omega; camelCase123Key -> camelcase123key
 * SNOWFLAKE: skip tracks, use blendo
 *    no tracks
 *    path to $1,000,000 -> PATH_TO_$1_000_000; 9omega -> _9OMEGA; camelCase123Key -> CAMELCASE123KEY
 * S3_DATALAKE: skip eescaping
 *    tracks table present
 *    no escaping on reserved keywords groups,timestamp
 *    path to $1,000,000 -> path_to_1_000_000; 9omega -> _9_omega; camelCase123Key -> camel_case_123_key
 * BQ, POSTGRES, CLICKHOUSE, MSSQL, AZURE_SYNAPSE -> default config
 */

const sampleEvents = {
    track: tracksConfig,
    identifies: identifiesConfig,
    screens: screensConfig,
    pages: pagesConfig,
    aliases: aliasesConfig,
    groups: groupsConfig,
};

function opInput(eventType) {
    return _.cloneDeep(sampleEvents[eventType].input);
}

function opOutput(eventType, provider) {
    switch (provider) {
        case "snowflake":
            return _.cloneDeep(sampleEvents[eventType].output.snowflake);
        case "s3_datalake":
            return _.cloneDeep(sampleEvents[eventType].output.s3_datalake);
        case "rs":
            return _.cloneDeep(sampleEvents[eventType].output.rs);
        case "bq":
            return _.cloneDeep(sampleEvents[eventType].output.bq);
        default:
            return _.cloneDeep(sampleEvents[eventType].output.default);
    }
}

module.exports = {opInput, opOutput};

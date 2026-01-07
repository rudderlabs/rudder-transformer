const { generateRandomString } = require('@rudderstack/integrations-lib');

const clientSecret = generateRandomString();
const ACCESS_TOKEN = generateRandomString();
const EXTERNAL_ID = 'marketoStaticListId';
const AUTH_HEADER_TOKEN = `Bearer ${ACCESS_TOKEN}`;
const CONTENT_TYPE = 'application/json';
const DEST_CONFIG = {
  clientId: 'marketo_static_list_client_id_success',
  clientSecret,
  accountId: 'marketo_static_list_unit_test_success',
  staticListId: 1122,
};
const DEST_DEFINITION = {
  ID: '1iVQvTRMsPPyJzwol0ifH93QTQ6',
  Name: 'MARKETO_STATIC_LIST',
  DisplayName: 'Marketo Static List',
  transformAt: 'processor',
  transformAtV1: 'processor',
};
const DEST_OBJECT = {
  ID: 'dummyDestinationId',
  Name: 'test_marketo_rc',
  DestinationDefinition: DEST_DEFINITION,
  Config: DEST_CONFIG,
  Enabled: true,
  Transformations: [],
  IsProcessorEnabled: true,
};
const MESSAGE_SOURCES_CONTEXT = {
  job_id: '2VsZs4hyPpq7f1p8igrpmHsibHl',
  job_run_id: 'ck99nbd2kqiljdihhkh0',
  task_run_id: 'ck99nbd2kqiljdihhkhg',
};

module.exports = {
  EXTERNAL_ID,
  ACCESS_TOKEN,
  AUTH_HEADER_TOKEN,
  CONTENT_TYPE,
  DEST_OBJECT,
  DEST_DEFINITION,
  MESSAGE_SOURCES_CONTEXT,
  DEST_CONFIG,
};

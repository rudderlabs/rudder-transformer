const EXTERNAL_ID = 'marketoStaticListId';
const TOKEN = 'Bearer access_token_success';
const CONTENT_TYPE = 'application/json';
const DEST_CONFIG = {
  clientId: 'marketo_client_id_success',
  clientSecret: 'marketo_client_secret_success',
  accountId: 'marketo_acct_id_success',
  staticListId: 1234,
};
const DEST_DEFINITION = {
  ID: '1iVQvTRMsPPyJzwol0ifH93QTQ6',
  Name: 'MARKETO',
  DisplayName: 'Marketo',
  transformAt: 'processor',
  transformAtV1: 'processor',
};
const DEST_OBJECT = {
  ID: '1zwa1wKshSt81YksKmUdJnr4IOK',
  Name: 'test_marketo_rc',
  DestinationDefinition: DEST_DEFINITION,
  Config: {
    clientId: 'marketo_client_id_success',
    clientSecret: 'marketo_client_secret_success',
    accountId: 'marketo_acct_id_success',
    staticListId: 1122,
  },
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
  TOKEN,
  CONTENT_TYPE,
  DEST_OBJECT,
  DEST_DEFINITION,
  MESSAGE_SOURCES_CONTEXT,
  DEST_CONFIG,
};

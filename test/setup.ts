// Set environment variables for tests before modules are loaded
process.env.GOOGLE_ADS_DEVELOPER_TOKEN = 'test-developer-token-12345';
process.env.DEST_ZOHO_DELETION_BATCHING_SUPPORTED_WORKSPACE_IDS = 'workspaceId2';
process.env.DEST_BRAZE_MAU_WORKSPACE_IDS_SKIP_LIST = 'workspace-non-mau';
process.env.DISABLE_TIKTOK_AUDIENCE_CDK_V2 = 'workspace-disable-cdkv2';

// Load Salesforce SDK mock before app loads when running Salesforce component tests
// so SOQL lookups use the mock and router tests pass (pattern: mock must be in place before first require of integrations-lib)
const isSalesforceDestinationTest = process.argv.some(
  (arg) => arg === '--destination=salesforce' || arg.includes('destination=salesforce'),
);
if (isSalesforceDestinationTest) {
  // eslint-disable-next-line global-require
  const { restoreSalesforceSDKMock } = require('./integrations/mocks/salesforceSDK.mock');
  restoreSalesforceSDKMock();
}

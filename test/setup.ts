// Set environment variables for tests before modules are loaded
process.env.GOOGLE_ADS_DEVELOPER_TOKEN = 'test-developer-token-12345';
process.env.DEST_ZOHO_DELETION_BATCHING_SUPPORTED_WORKSPACE_IDS = 'workspaceId2';
process.env.DEST_BRAZE_MAU_WORKSPACE_IDS_SKIP_LIST = 'workspace-non-mau';
process.env.DISABLE_LINKEDIN_AUDIENCE_CDK_V2 = 'workspace-disable-cdkv2';

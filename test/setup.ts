// Set environment variables for tests before modules are loaded
process.env.GOOGLE_ADS_DEVELOPER_TOKEN = 'test-developer-token-12345';
process.env.DEST_BRAZE_MAU_WORKSPACE_IDS_SKIP_LIST = 'workspace-non-mau';
process.env.DEST_GAEC_ADJUSTMENT_TYPE_SUPPORTED_WORKSPACE_IDS = 'workspaceId1,workspaceId2';
process.env.DEST_HS_RETL_SPLIT_WORKSPACE_IDS = 'retl-split-ws';
process.env.BRAZE_PER_JOB_DELIVERY_MAPPING_WORKSPACE_IDS = 'braze-pjdm-ws';

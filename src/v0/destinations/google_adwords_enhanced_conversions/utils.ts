const { isDefinedAndNotNull } = require('../../util');

let adjustmentTypeSupportedWorkspaceIds: string | Map<string, boolean> = 'NONE';
if (isDefinedAndNotNull(process.env.DEST_GAEC_ADJUSTMENT_TYPE_SUPPORTED_WORKSPACE_IDS)) {
  const supportedWorkspaceIds = process.env.DEST_GAEC_ADJUSTMENT_TYPE_SUPPORTED_WORKSPACE_IDS!;
  switch (supportedWorkspaceIds) {
    case 'ALL':
      adjustmentTypeSupportedWorkspaceIds = 'ALL';
      break;
    case 'NONE':
      adjustmentTypeSupportedWorkspaceIds = 'NONE';
      break;
    default:
      adjustmentTypeSupportedWorkspaceIds = new Map(
        supportedWorkspaceIds.split(',').map((s) => [s.trim(), true]),
      );
  }
}

const isCustomAdjustmentTypeSupported = (workspaceId: string) => {
  if (adjustmentTypeSupportedWorkspaceIds === 'ALL') {
    return true;
  }
  if (adjustmentTypeSupportedWorkspaceIds === 'NONE') {
    return false;
  }
  return (adjustmentTypeSupportedWorkspaceIds as Map<string, boolean>).has(workspaceId);
};

export { isCustomAdjustmentTypeSupported };

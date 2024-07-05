const logDestIds = (process.env.LOG_DEST_IDS ?? '').split(',')?.map?.((s) => s?.trim?.()); // should be comma separated
const logWspIds = (process.env.LOG_WSP_IDS ?? '').split(',')?.map?.((s) => s?.trim?.()); // should be comma separated

const isMetadataMatching = (m) => {
  const isDestIdConfigured = logDestIds?.find?.((envDId) => envDId && envDId === m?.destinationId);
  const isWspIdConfigured = logWspIds?.find?.(
    (envWspId) => envWspId && envWspId === m?.workspaceId,
  );
  return Boolean(isDestIdConfigured || isWspIdConfigured);
};

const getMatchedMetadata = (metadata) => {
  if (!Array.isArray(metadata)) {
    if (isMetadataMatching(metadata)) {
      return [metadata];
    }
    return [];
  }
  return metadata.filter((m) => isMetadataMatching(m));
};

module.exports = {
  isMetadataMatching,
  getMatchedMetadata,
};

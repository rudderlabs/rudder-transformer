const MAX_LEAD_IDS_SIZE = 300;
const DESTINATION = 'Marketo Static List';

const formatConfig = (destination) => ({
  ID: destination.ID,
  ...destination.Config,
});

module.exports = {
  DESTINATION,
  formatConfig,
  MAX_LEAD_IDS_SIZE,
};

const destinationConfigKeys = {
  BRANCH_KEY: "branchKey",
  BRANCH_SECRET: "branchSecret"
};

const baseEndpoint = "https://api2.branch.io";
const endpoints = {
  standardEventUrl: `${baseEndpoint}/v2/event/standard`,
  customEventUrl: `${baseEndpoint}/v2/event/custom`
};

module.exports = {
  destinationConfigKeys,
  endpoints
};

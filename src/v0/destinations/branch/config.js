const baseEndpoint = 'https://api2.branch.io';
const endpoints = {
  standardEventUrl: `${baseEndpoint}/v2/event/standard`,
  customEventUrl: `${baseEndpoint}/v2/event/custom`,
};

module.exports = {
  endpoints,
};

const { getContactEndpoint, destType } = require('./config');
const { handleHttpRequest } = require('../../../../adapters/network');

const checkIfContactExists = async (config, contactId, email) => {
  const basicAuth = Buffer.from(`${config.apiKey}:`).toString('base64');
  const endpoint = getContactEndpoint(config, contactId, email);
  const { processedResponse } = await handleHttpRequest(
    'get',
    endpoint,
    {
      headers: {
        Authorization: `Basic ${basicAuth}`,
      },
    },
    {
      destType,
      feature: 'transformation',
      requestMethod: 'GET',
      endpointPath: contactId ? '/contacts' : '/contacts/email',
      module: 'router',
    },
  );

  // eslint-disable-next-line no-underscore-dangle
  return processedResponse.status === 200 && !!processedResponse.response?._id;
};

module.exports = {
  checkIfContactExists,
};

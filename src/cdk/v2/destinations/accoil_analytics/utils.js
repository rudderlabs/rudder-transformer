const stgRegex = new RegExp(/^stg_/, 'i');

const endpointUrl = (apiKey) => {
  const staging = stgRegex.test(apiKey);
  return staging ? 'https://instaging.accoil.com/segment' : 'https://in.accoil.com/segment';
};

module.exports = {
  endpointUrl,
};
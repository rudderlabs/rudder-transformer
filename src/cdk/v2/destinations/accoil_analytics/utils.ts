const stgRegex = /^stg_/i;

export const endpointUrl = (apiKey: string): string => {
  const staging: boolean = stgRegex.test(apiKey);
  return staging ? 'https://instaging.accoil.com/segment' : 'https://in.accoil.com/segment';
};

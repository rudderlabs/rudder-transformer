export const stringifyValues = (data: Record<string, any>): Record<string, string> => {
  const output: Record<string, any> = { ...data };
  Object.keys(output).forEach((key) => {
    if (typeof output[key] !== 'string') {
      output[key] = JSON.stringify(output[key]);
    }
  });
  return output;
};

const process = input => {
  const inputs = input;
  inputs.batched = false;
  inputs.statusCode = 200;
  return inputs;
};
exports.process = process;

const process = async (event, source) => {
  const { Config } = source;
  const { process } =
    Config?.version === 'v1' ? require('./v1/transform') : require('./v0/transform');
  return process(event);
};

exports.process = process;

function process(event) {
  const result = {
    output: {
      message: event.message,
      userId: event.message.userId || event.message.anonymousId,
      config: event.destination.Config
    }
  };
  return result;
}

exports.process = process;

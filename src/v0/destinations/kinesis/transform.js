function process(event) {
  const result = {
    message: event.message,
    userId: event.message.userId || event.message.anonymousId,
  };
  return result;
}

exports.process = process;

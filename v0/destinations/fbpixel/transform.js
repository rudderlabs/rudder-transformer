const processEvent = (message, destination) => {};

const process = event => {
  return processEvent(event.message, event.destination);
};

exports.process = process;

function process(events) {
  return events.map(event => event.message);
}

exports.process = process;

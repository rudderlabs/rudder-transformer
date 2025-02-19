module.exports = function echo(events) {
  return {
    transformedEvents: events,
    retryStatus: 200,
  };
};

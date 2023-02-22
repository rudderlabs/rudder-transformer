const getPIIDestinationList = () => {
  return (process.env.WHITELIST_PII_DESTINATION || 'customerio').trim().split(',');
};

const doesEventContainsTraits = event => {
  return event && event.message && event.message.traits;
};

const doesEventContainContextTraits = event => {
  return event && event.message && event.message.context && event.message.context.traits;
};
const changeDateFormatForCustomerio = (destination, event) => {
  if (getPIIDestinationList().includes(destination)) {
    if (doesEventContainContextTraits(event)) {
      // eslint-disable-next-line no-param-reassign
      event.message.context.traits.accountCreatedDate = Math.floor(
        Date.parse(event.message.context.traits.accountCreatedDate) / 1000,
      );
    }
    if (doesEventContainsTraits(event)) {
      // eslint-disable-next-line no-param-reassign
      event.message.traits.accountCreatedDate = Math.floor(
        Date.parse(event.message.traits.accountCreatedDate) / 1000,
      );
    }
  }
};

const oncehubTransformer = (destination, event) => {
  changeDateFormatForCustomerio(destination, event);

  if (!getPIIDestinationList().includes(destination) && doesEventContainsTraits(event)) {
    // eslint-disable-next-line no-param-reassign
    delete event.message.traits.email;
    // eslint-disable-next-line no-param-reassign
    delete event.message.traits.firstName;
    // eslint-disable-next-line no-param-reassign
    delete event.message.traits.lastName;

    if (doesEventContainContextTraits(event)) {
      // eslint-disable-next-line no-param-reassign
      delete event.message.context.traits.email;
      // eslint-disable-next-line no-param-reassign
      delete event.message.context.traits.firstName;
      // eslint-disable-next-line no-param-reassign
      delete event.message.context.traits.lastName;
    }
  }
  // eslint-disable-next-line no-console

  // console.log(" , ==> event here : ", JSON.stringify(event));
  return event;
};

module.exports = {
  oncehubTransformer,
};

export const processAgnosticEvent = (message, destination) => {
  /**
   * if message.action = insert, update
   * insert --> create contact / track event
   * update --> update contact
   * object --> externalID
   *
   *
   * if object === identify && action = insert --> create contact
   * if object === identify && action = update --> update contact
   * else track event
   */
};

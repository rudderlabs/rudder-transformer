/**
 * This function returns the organization_id from apiUrl path
 * example
    path : "/api/v2/organizations/org_DqzHLxgABzej3mwL/members"
    groupId : org_DqzHLxgABzej3mwL
 * @param {*} event
 */
const getGroupId = (event) => {
  if (!event?.details?.request?.path) return '';
  const { path } = event.details.request;
  const pathArray = path.split('/');
  return pathArray[pathArray.length - 2];
};

module.exports = { getGroupId };

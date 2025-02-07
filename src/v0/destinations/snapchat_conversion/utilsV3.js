const { getFieldValueFromMessage } = require('../../util');

// Utility function to extract the click_id from the event_source_url
const extractClickIdFromUrl = (message) => {
  try {
    const eventSourceUrl = getFieldValueFromMessage(message, 'pageUrl');

    if (!eventSourceUrl) {
      throw new Error('URL not found in message');
    }

    const urlObj = new URL(eventSourceUrl);
    const clickId = urlObj.searchParams.get('ScCid'); // 'ScCid' is the query parameter for click_id

    return clickId;
  } catch (error) {
    return null; 
  }
};

function getEndpointWithClickId(endpoint, message) {
  let clickId;

  const scClickId = getFieldValueFromMessage(message, 'scClickId');

  if (scClickId) {
    clickId = scClickId;
  } else {
    const eventSourceUrl = getFieldValueFromMessage(message, 'eventSourceUrl');
    if (eventSourceUrl) {
      clickId = extractClickIdFromUrl(eventSourceUrl);
    }
  }

  // If no Click ID is found after all the checks, throw an error
  if (!clickId) {
    throw new Error('Click ID (ScCid) is required either in the event_source_url or user input');
  }

  // Replace {ID} in the endpoint with the found Click ID
  const urlObj = new URL(endpoint);
  if (urlObj.pathname.includes('{ID}')) {
    urlObj.pathname = urlObj.pathname.replace('{ID}', clickId);
  } else {
    throw new Error('Endpoint URL does not contain {ID} placeholder');
  }

  // Return the updated endpoint URL with the scClickId replaced
  return urlObj.toString();
}

module.exports = { getEndpointWithClickId, extractClickIdFromUrl };

/// Utility function to extract the click_id (ScCid) from the event_source_url
const extractClickIdFromUrl = (url) => {
  try {
    const urlObj = new URL(url);
    const clickId = urlObj.searchParams.get('ScCid'); // 'ScCid' is the query parameter for click_id
    return clickId || null; // Return null if not found
  } catch (error) {
    return null;
  }
};

function getEndpointWithClickId(endpoint, message) {
  let clickId;

  // Check if scClickId is provided directly in the message
  if (message.properties.sc_click_id) {
    clickId = message.properties.sc_click_id;
  } else {
    // Check if the eventSourceUrl is provided in message properties or directly
    const eventSourceUrl = message.event_source_url || message.properties?.event_source_url;
    if (eventSourceUrl) {
      clickId = extractClickIdFromUrl(eventSourceUrl); // Extract from URL if present
    }
  }

  // If no Click ID is found after all the checks, throw an error
  if (!clickId) {
    throw new Error('Click ID (ScCid) is required either in the event_source_url or user input');
  }

  // Replace {ID} in the endpoint with the found Click ID
  let urlObj = decodeURIComponent(endpoint);

  urlObj = urlObj.replace('{ID}', clickId);

  // Return the updated endpoint URL with the scClickId replaced
  return urlObj;
}

module.exports = { getEndpointWithClickId, extractClickIdFromUrl };

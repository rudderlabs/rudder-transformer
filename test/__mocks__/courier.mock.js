const MOCK_DATA = {
  messageId: "MOCK_MESSAGE_ID"
};

const courierGetRequestHandler = url => {
  if (url === "https://api.courier.com/inbound/rudderstack") {
    return { data: MOCK_DATA, status: 202 };
  }

  return Promise.resolve({ error: "Request failed", status: 404 });
};

module.exports = { courierGetRequestHandler };

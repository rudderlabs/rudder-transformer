const dripPostRequestHandler = (url, payload) => {
  if (url === "https://api.getdrip.com/v2/1809802/subscriber")
    return Promise.resolve({ data: payload, status: 200 });

  return Promise.resolve({ data: payload, status: 200 });
};

module.exports = { dripPostRequestHandler };

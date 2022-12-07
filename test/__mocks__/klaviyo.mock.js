const klaviyoGetRequestHandler = (url, payload) => {
  if (
    url.includes(
      "https://a.klaviyo.com/api/v2/people/search?api_key=pk_b68c7b5163d98807fcb57e6f921216629d&email=utsab@rudderstack.com"
    )
  ) {
    return Promise.resolve({
      data: {
        id: "01G79MV4XVPABNP8G5FSK40QES"
      },
      status: 200
    });
  } else {
    return Promise.resolve({
      data: {
        detail: "There is no profile matching the given parameters."
      },
      status: 404
    });
  }
};

const klaviyoPostRequestHandler = (url, payload) => {
  switch (url) {
    case "https://a.klaviyo.com/api/v2/list/XUepkK/subscribe":
      //resolve with status 200
      return { data: payload, status: 200 };
    case "https://a.klaviyo.com/api/v2/list/XUepkK/members":
      //resolve with status 200
      return { data: payload, status: 200 };
    default:
      return new Promise((resolve, reject) => {
        if (payload) {
          resolve({ data: payload });
        } else {
          resolve({ error: "Request failed" });
        }
      });
  }
};

module.exports = {
  klaviyoPostRequestHandler,
  klaviyoGetRequestHandler
};

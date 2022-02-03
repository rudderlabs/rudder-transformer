const profitwellGetRequestHandler = (url, payload) => {
  if (url === "https://api.profitwell.com/v2/users/pwu_Oea7HXV3bnTP/")
    return Promise.resolve({ data: payload, status: 200 });
  else if (url === "https://api.profitwell.com/v2/users/spiderman_1a/") {
    return Promise.resolve({ data: payload, status: 200 });
  }
  return Promise.reject({
    response: {
      message: "Request failed with status code 404",
      status: 404,
      statusText: "Not Found"
    }
  });
};

module.exports = profitwellGetRequestHandler;

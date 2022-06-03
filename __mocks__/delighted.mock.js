const delightedGetRequestHandler = options => {
  const { params } = options;
  if (params.email === "identified_user@email.com") {
    return Promise.resolve({ data: ["user data"], status: 200 });
  }
  if (params.email === "unidentified_user@email.com") {
    return Promise.resolve({ data: [], status: 200 });
  }
  return Promise.resolve({ data: [], status: 200 });
};

module.exports = { delightedGetRequestHandler };

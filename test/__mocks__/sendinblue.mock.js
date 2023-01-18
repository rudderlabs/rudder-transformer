const sendinblueGetRequestHandler = (url, mockData) => {
  if (
    url ===
      "https://api.sendinblue.com/v3/contacts/gordon_pittman%40example.com" ||
    url === "https://api.sendinblue.com/v3/contacts/42"
  ) {
    return { data: mockData, status: 200 };
  }

  return Promise.reject({
    response: {
      data: {
        code: "document_not_found",
        message: "Contact does not exist"
      },
      status: 404
    }
  });
};

module.exports = {
  sendinblueGetRequestHandler
};

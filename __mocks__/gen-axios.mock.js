const axios = require("axios");
const { isHttpStatusSuccess } = require("../v0/util");
jest.mock("axios");

/**
 * Forms the mock axios client
 * @param {Array<{type: 'constructor'|'get'|'post'|'delete', response: any }>} responsesData
 * @returns
 */
const formAxiosMock = responsesData => {
  const returnVal = ({ resp, mockInstance }) => {
    if (isHttpStatusSuccess(resp.response.status)) {
      mockInstance.mockResolvedValueOnce(resp.response);
    } else {
      mockInstance.mockRejectedValueOnce(resp.response);
    }
  };

  if (Array.isArray(responsesData)) {
    const constructorMock = jest.fn();
    const postMock = jest.fn();
    const getMock = jest.fn();
    const deleteMock = jest.fn();
    responsesData.flat().forEach(resp => {
      switch (resp.type) {
        case "constructor":
          returnVal({ resp, mockInstance: constructorMock });
          break;
        case "get":
          returnVal({ resp, mockInstance: getMock });
          break;
        case "delete":
          returnVal({ resp, mockInstance: deleteMock });
          break;

        default:
          returnVal({ resp, mockInstance: postMock });
          break;
      }
    });
    axios.get = getMock;
    axios.post = postMock;
    axios.delete = deleteMock;
    axios.mockImplementation(constructorMock);
  }
  return axios;
};

module.exports = formAxiosMock;

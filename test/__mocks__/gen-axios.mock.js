const axios = require("axios");
const logger = require("../../src/logger");
const { isHttpStatusSuccess } = require("../../src/v0/util");

jest.mock("axios");

/**
 * Forms the mock axios client
 * This client is used in cases where each response is returned almost immediately
 *
 * **Limitations**:
 * - This mock client would not be useful for scenarios where parallel requests will be made(with randomly responding to requests)
 * - This mock client would not be useful in-case there are delays needed in responding to requests
 *
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
      let mockInstance;
      switch (resp.type) {
        case "constructor":
          mockInstance = constructorMock;
          break;
        case "get":
          mockInstance = getMock;
          break;
        case "delete":
          mockInstance = deleteMock;
          break;

        default:
          mockInstance = postMock;
          break;
      }
      let methodParams = { resp, mockInstance };
      // validateMockClientReqParams(methodParams);
      returnVal(methodParams);
    });
    axios.get = getMock;
    axios.post = postMock;
    axios.delete = deleteMock;
    axios.mockImplementation(constructorMock);
  }
  return axios;
};

const validateMockAxiosClientReqParams = ({ resp }) => {
  let mockInstance;
  switch (resp.type) {
    case "constructor":
      mockInstance = axios;
      break;
    case "get":
      mockInstance = axios.get;
      break;
    case "delete":
      mockInstance = axios.delete;
      break;

    default:
      mockInstance = axios.post;
      break;
  }
  if (Array.isArray(resp?.reqParams)) {
    try {
      expect(mockInstance).toHaveBeenCalledWith(...resp.reqParams);
    } catch (error) {
      logger.error(
        `Validate request parameters error ${resp.type} for mock axios client: ${error}`
      );
    }
  }
};

module.exports = { formAxiosMock, validateMockAxiosClientReqParams };

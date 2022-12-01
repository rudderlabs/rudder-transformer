const { formAxiosMock } = require("../__mocks__/gen-axios.mock");
const promiseAllRequests = [...Array(10).keys()];
const promiseAllResponses = promiseAllRequests.map(reqId => ({
  type: "get",
  response: {
    data: {
      respId: `resp-${reqId}`
    },
    status: 200,
    statusText: "OK"
  }
}))
const responses = [
  [
    {
      type: "get",
      response: {
        data: {
          a: 1
        },
        status: 200,
        statusText: "OK"
      }
    },
    {
      type: "constructor",
      response: {
        data: {
          b: 2
        },
        status: 200,
        statusText: "OK"
      }
    },
    {
      type: "post",
      response: {
        data: {
          c: 3
        },
        status: 200,
        statusText: "OK"
      }
    }
  ],
  [
    {
      type: "get",
      response: {
        data: {
          d: 4
        },
        status: 200,
        statusText: "OK"
      }
    },
    {
      type: "constructor",
      response: {
        data: {
          e: 5
        },
        status: 200,
        statusText: "OK"
      }
    },
    {
      type: "post",
      response: {
        data: {
          f: 6
        },
        status: 200,
        statusText: "OK"
      }
    }
  ],
  promiseAllResponses,
];
formAxiosMock(responses);
const { httpSend, httpGET, httpPOST } = require("../adapters/network");
const axios = require("axios");

const mockMethod1 = async () => {
  // some random code execution before axios.get
  const resp1 = await axios.get("http:///wwww.example.com/1");
  // some random code execution before axios
  const resp2 = await axios({
    url: "http://www.example.com/2",
    method: "post"
  });
  // some random code executed before axios.post
  const resp3 = await axios.post("http://www.example.com/3")
  return [
    resp1,
    resp2,
    resp3
  ];
}
const mockMethod2 = async () => {
  // some random code executed before httpGET
  const resp1 = await httpGET("http:///wwww.example.com/1");
  // some random code executed before httpSend
  const resp2 = await httpSend({
    url: "http://www.example.com/2",
    method: "post"
  });
  // some random executed before httpPOST call
  const resp3 = await httpPOST("http://www.example.com/3")
  return [
    resp1,
    resp2,
    resp3
  ];
}


const mockMethodWithPromiseAll = async () => {
  const promiseAllResults = await Promise.all(
    promiseAllRequests.map(async _reqId => {
      const getRes = await httpGET("http://www.example.com/get");
      return getRes.response;
    })
  )
  return promiseAllResults;
}


describe("Testing gen-axios mocker", () => {
  test("test mockMethod1", async () => {
    const mockMethodResults = await mockMethod1();
    mockMethodResults.forEach((result, index) => {
      expect(result).toMatchObject(
        expect.objectContaining(responses[0][index].response)
      )
    });
  });

  test('test mockMethod2', async () => {
    const mockMethodResults = await mockMethod2();
    mockMethodResults.forEach(({success, response}, index) => {
      expect(success).toEqual(true);
      expect(response).toMatchObject(
        expect.objectContaining(responses[1][index].response)
      )
    })
  })

  test('testing mockMethodWithPromiseAll', async () => {
    const promAllResults = await mockMethodWithPromiseAll();
    promAllResults.forEach((result, index) => {
      expect(result).toMatchObject(
        expect.objectContaining(responses[2][index].response)
      )
    });
  })

});

const { cleanResponse } = require("../../../src/cdk/lytics/transform");

describe("Test for Lytics common post mapper", () => {
  it("should remove both first name and last name from mappedPayload", () => {
    const mappedPayload = {
      firstname: "somename",
      lastName: "lastName",
      some: "otherKey"
    };
    const resp = cleanResponse({}, mappedPayload, {});
    const expected = { some: "otherKey" };
    expect(resp).toEqual(expected);
  });
});

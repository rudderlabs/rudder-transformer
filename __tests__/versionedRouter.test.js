//versionedRouter.test.js
const chai = require("chai");
const chaiHttp = require("chai-http");
const { server, serverClose } = require("../destTransformer.js");
const fs = require("fs");
const path = require("path");
const expect = chai.expect;
chai.use(chaiHttp);

describe("test batch end point", () => {
  //   it("test /batch", async done => {
  //       const requestBody = fs.readFileSync(
  //       path.resolve(__dirname, `./data/versioned_batch_input.json`)
  //     );
  //     console.log(requestBody);
  //     const responseBody = fs.readFileSync(
  //       path.resolve(__dirname, `./data/versioned_batch_output.json`)
  //     );
  //     chai
  //       .request(await serverOpen())
  //       .post("/batch")
  //       .set("content-type", "application/json")
  //       .send(JSON.parse(requestBody))
  //       .end((err, res) => {
  //         expect(res).to.have.status(200);
  //         // expect(res.text).equal(JSON.parse(responseBody).toString());
  //         expect(res.text).equal(JSON.stringify(JSON.parse(responseBody)));
  //         done();
  //       });
  //   });
  it("test /routerTransform", async () => {
    const requestBody = fs.readFileSync(
      path.resolve(__dirname, `./data/versioned_router_input.json`)
    );
    const responseBody = fs.readFileSync(
      path.resolve(__dirname, `./data/versioned_router_output.json`)
    );
    let res = await chai
      .request(server)
      .post("/routerTransform")
      .set("content-type", "application/json")
      .send(JSON.parse(requestBody));
    expect(res).to.have.status(200);
    expect(res.text).equal(JSON.stringify(JSON.parse(responseBody)));
    await serverClose();
  });

//   afterEach(async () => {
//     await serverClose();
//     console.log("closing")
//   });
});

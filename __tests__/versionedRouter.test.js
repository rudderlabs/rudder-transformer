const vRouter = require("../versionedRouter");
const fs = require("fs");
const path = require("path");
const version = "v0";

const destArg = process.argv.filter(x => x.startsWith("--destName="))[0]; // send arguments on which destination
const typeArg = process.argv.filter(x => x.startsWith("--type="))[0]; // send argument on which function

// eg: jest versionedRouter --destName=am --type=batch
// eg: jest versionedRouter --destName=heap --type=processor
// eg: jest versionedRouter --destName=heap --type=router
// eg: jest versionedRouter --type=all

let destination;
if (typeArg){
  destination = destArg ? destArg.split("=")[1] : "heap"; // default
  type = typeArg.split("=")[1];
  let reqBody;
  let respBody;
  if (type !== "all") {
    try{
    reqBody = JSON.parse(
      fs.readFileSync(
        path.resolve(
          __dirname,
          `./data/versioned_${type}_${destination}_input.json`
        )
      )
    );
    respBody = JSON.parse(
      fs.readFileSync(
        path.resolve(
          __dirname,
          `./data/versioned_${type}_${destination}_output.json`
        )
      )
    );
        }catch(error){
          throw new Error("destination/type not valid" + error);
        }
  }
  if (type === "router") {
    it(`Testing: routerHandleDest`, async () => {
      const output = await vRouter.routerHandleDest(reqBody);
      expect(output).toEqual(respBody);
    });
  } else if (type === "processor") {
    it(`Testing: handleDest`, async () => {
      const output = await vRouter.handleDest(reqBody, version, destination);
      expect(output).toEqual(respBody);
    });
  } else if (type === "batch") {
    it(`Testing: batchHandler`, async () => {
      const output = await vRouter.batchHandler(reqBody);
      expect(output).toEqual(respBody);
    });
  } else if (type === "all") {
    it(`Testing: routerHandleDest`, async () => {
      const reqBody = JSON.parse(
        fs.readFileSync(
          path.resolve(
            __dirname,
            `./data/versioned_router_${destination}_input.json`
          )
        )
      );
      const respBody = JSON.parse(
        fs.readFileSync(
          path.resolve(
            __dirname,
            `./data/versioned_router_${destination}_output.json`
          )
        )
      );
      const output = await vRouter.routerHandleDest(reqBody);
      expect(output).toEqual(respBody);
    });
    it(`Testing: handleDest`, async () => {
      const reqBody = JSON.parse(
        fs.readFileSync(
          path.resolve(
            __dirname,
            `./data/versioned_processor_${destination}_input.json`
          )
        )
      );
      const respBody = JSON.parse(
        fs.readFileSync(
          path.resolve(
            __dirname,
            `./data/versioned_processor_${destination}_output.json`
          )
        )
      );
      destination = destination || "heap"; // default
      const output = await vRouter.handleDest(reqBody, version, destination);
      expect(output).toEqual(respBody);
    });
    it(`Testing: batchHandler`, async () => {
      const reqBody = JSON.parse(
        fs.readFileSync(
          path.resolve(__dirname, `./data/versioned_batch_braze_input.json`)
        )
      );
      const respBody = JSON.parse(
        fs.readFileSync(
          path.resolve(__dirname, `./data/versioned_batch_braze_output.json`)
        )
      );
      const output = await vRouter.batchHandler(reqBody);
      expect(output).toEqual(respBody);
    });
  } else {
    it(`Type is not all/router/batch/processor`, () => {
      expect("Type is not all/router/batch/processor").toEqual(
        "Type is not all/router/batch/processor"
      );
    });
  }
} else {
  it(`No type and destination mentioned for testing versionedRouter`, () => {
    expect("no command line argument provided").toEqual(
      "no command line argument provided"
    );
  });
}

const vRouter = require("../versionedRouter");
const fs = require("fs");
const path = require("path");
const version = "v0";

const destArg = process.argv.filter(x => x.startsWith("--destName="))[0]; // send arguments on which destination
const typeArg = process.argv.filter(x => x.startsWith("--type="))[0]; // send argument on which function

// eg: jest versionedRouter --destName=am --type=batch
// eg: jest versionedRouter --destName=heap --type=processor
// eg: jest versionedRouter --destName=heap --type=router

let destination;
if (destArg && typeArg) {
  destination = destArg.split("=")[1];
  type = typeArg.split("=")[1];
  const reqBody = JSON.parse(
    fs.readFileSync(
      path.resolve(
        __dirname,
        `./data/versioned_${type}_${destination}_input.json`
      )
    )
  );
  const respBody = JSON.parse(
    fs.readFileSync(
      path.resolve(
        __dirname,
        `./data/versioned_${type}_${destination}_output.json`
      )
    )
  );

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
  }
} else {
  it(`No type and destination mentioned for testing versionedRouter`, () => {
    expect("no command line argument provided").toEqual(
      "no command line argument provided"
    );
  });
}

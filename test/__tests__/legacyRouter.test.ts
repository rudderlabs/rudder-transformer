import fs from 'fs';
import path from 'path';
import DestinationController from '../../src/controllers/destination';
const destArg = process.argv.filter((x) => x.startsWith('--destName='))[0]; // send arguments on which destination
const typeArg = process.argv.filter((x) => x.startsWith('--type='))[0]; // send argument on which function

// To invoke CDK live compare:
// router: CDK_LIVE_TEST=1 npx jest versionedRouter --destName=algolia --type=router
// processor: CDK_LIVE_TEST=1 npx jest versionedRouter --destName=algolia --type=processor

let destination;
if (typeArg) {
  destination = destArg ? destArg.split('=')[1] : 'heap'; // default
  const type = typeArg.split('=')[1];
  let reqBody;
  let respBody;
  if (type !== 'all') {
    try {
      reqBody = JSON.parse(
        fs
          .readFileSync(
            path.resolve(__dirname, `./data/versioned_${type}_${destination}_input.json`),
          )
          .toString(),
      );
      respBody = JSON.parse(
        fs
          .readFileSync(
            path.resolve(__dirname, `./data/versioned_${type}_${destination}_output.json`),
          )
          .toString(),
      );
    } catch (error) {
      throw new Error('destination/type not valid' + error);
    }
  }
  if (type === 'router') {
    it(`Testing: routerHandleDest`, async () => {
      const output = await DestinationController.destinationTransformAtRouter(reqBody);
      expect(output).toEqual(respBody);
    });
  } else if (type === 'processor') {
    it(`Testing: handleDest`, async () => {
      const output = await DestinationController.destinationTransformAtProcessor(reqBody);
      expect(output).toEqual(respBody);
    });
  } else if (type === 'batch') {
    it(`Testing: batchHandler`, async () => {
      const output = await DestinationController.batchProcess(reqBody);
      expect(output).toEqual(respBody);
    });
  } else if (type === 'all') {
    it(`Testing: routerHandleDest`, async () => {
      const reqBody = JSON.parse(
        fs
          .readFileSync(
            path.resolve(__dirname, `./data/versioned_router_${destination}_input.json`),
          )
          .toString(),
      );
      const respBody = JSON.parse(
        fs
          .readFileSync(
            path.resolve(__dirname, `./data/versioned_router_${destination}_output.json`),
          )
          .toString(),
      );
      const output = await DestinationController.destinationTransformAtRouter(reqBody);
      expect(output).toEqual(respBody);
    });
    it(`Testing: handleDest`, async () => {
      const reqBody = JSON.parse(
        fs
          .readFileSync(
            path.resolve(__dirname, `./data/versioned_processor_${destination}_input.json`),
          )
          .toString(),
      );
      const respBody = JSON.parse(
        fs
          .readFileSync(
            path.resolve(__dirname, `./data/versioned_processor_${destination}_output.json`),
          )
          .toString(),
      );
      destination = destination || 'heap'; // default
      const output = await DestinationController.destinationTransformAtProcessor(reqBody);
      expect(output).toEqual(respBody);
    });
    it(`Testing: batchHandler`, async () => {
      const reqBody = JSON.parse(
        fs
          .readFileSync(path.resolve(__dirname, `./data/versioned_batch_braze_input.json`))
          .toString(),
      );
      const respBody = JSON.parse(
        fs
          .readFileSync(path.resolve(__dirname, `./data/versioned_batch_braze_output.json`))
          .toString(),
      );
    });
  } else {
    it(`Type is not all/router/batch/processor`, () => {
      expect('Type is not all/router/batch/processor').toEqual(
        'Type is not all/router/batch/processor',
      );
    });
  }
} else {
  it(`No type and destination mentioned for testing versionedRouter`, () => {
    expect('no command line argument provided').toEqual('no command line argument provided');
  });
}

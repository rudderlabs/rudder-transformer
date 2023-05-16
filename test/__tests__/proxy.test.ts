const name = 'Proxy';
import fs from 'fs';
import path from 'path';
import { mockedAxiosClient } from '../__mocks__/network';

const destinations = [
  'marketo',
];
import DeliveryController from '../../src/controllers/delivery';

jest.mock('axios', () => jest.fn(mockedAxiosClient));

// start of generic tests
const inputDataFile = fs.readFileSync(path.resolve(__dirname, `./data/proxy_input.json`));
const outputDataFile = fs.readFileSync(path.resolve(__dirname, `./data/proxy_output.json`));
const inputData = JSON.parse(inputDataFile.toString());
const expectedData = JSON.parse(outputDataFile.toString());

inputData.forEach((input, index) => {
  it(`${name} Tests: payload - ${index}`, async () => {
    const output = await DeliveryController.deliverToDestination(input);
    expect(output).toEqual(expectedData[index]);
  });
});
// end of generic tests

// destination tests start
destinations.forEach((destination) => {
  const inputDataFile = fs.readFileSync(
    path.resolve(__dirname, `./data/${destination}_proxy_input.json`),
  );
  const outputDataFile = fs.readFileSync(
    path.resolve(__dirname, `./data/${destination}_proxy_output.json`),
  );
  const inputData = JSON.parse(inputDataFile.toString());
  const expectedData = JSON.parse(outputDataFile.toString());

  describe(`Proxy Test for ${destination}`, () => {
    inputData.forEach((input, index) => {
      it(`${name} Tests: ${destination} - Payload ${index}`, async () => {
        const output = await DeliveryController.deliverToDestination(input);
        expect(output).toEqual(expectedData[index]);
      });
    });
  });
});
// destination tests end

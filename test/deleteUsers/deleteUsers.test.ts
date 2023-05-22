const name = 'DeleteUsers';
import logger from '../../src/logger';
import { formAxiosMock, validateMockAxiosClientReqParams } from '../__mocks__/gen-axios.mock';
const deleteUserDestinations = [
  'am',
  'braze',
  'intercom',
  'mp',
  'af',
  'clevertap',
  'engage',
  'ga',
  'sendgrid',
];
// Note: Useful for troubleshooting not to be used in production
const exclusionDestList: string[] = [];
import RegulationController from '../../src/controllers/regulation';

// delete user tests
deleteUserDestinations
  .filter((d) => !exclusionDestList.includes(d))
  .forEach((destination) => {
    const inputData = require(`./data/${destination}/handler_input.json`);
    const expectedData = require(`./data/${destination}/handler_output.json`);

    let axiosResponses;
    describe(`${name} Tests: ${destination}`, () => {
      jest.unmock('axios');
      beforeAll(() => {
        try {
          axiosResponses = require(`./data/${destination}/nw_client_data.json`);
        } catch (error) {
          // Do nothing
          logger.error(`Error while reading /${destination}/nw_client_data.json: ${error}`);
        }
        if (Array.isArray(axiosResponses)) {
          formAxiosMock(axiosResponses);
        } else {
          // backward compatibility
          jest.mock('axios');
        }
      });

      inputData.forEach((input, index) => {
        it(`Payload - ${index}`, async () => {
          try {
            input.get = jest.fn((destInfoKey) => {
              return input.getValue && input.getValue[destInfoKey];
            });

            const output = await RegulationController.deleteUsers(input);
            // validate the axios arguments
            if (Array.isArray(axiosResponses) && Array.isArray(axiosResponses[index])) {
              axiosResponses[index].forEach((axsRsp) => {
                validateMockAxiosClientReqParams({
                  resp: axsRsp,
                });
              });
            }
            expect(output.body).toEqual(expectedData[index]);
          } catch (error: any) {
            expect(error.message).toEqual(expectedData[index].error);
          }
        });
      });
    });
  });

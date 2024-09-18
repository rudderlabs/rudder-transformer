const { getDataSource, responseBuilderSimple, getUpdatedDataElement } = require('./util');

const basePayload = {
  responseField: {
    access_token: 'ABC',
    payload: {
      schema: ['EMAIL', 'FI'],
      data: [
        [
          'b100c2ec0718fe6b4805b623aeec6710719d042ceea55f5c8135b010ec1c7b36',
          '1e14a2f476f7611a8b22bc85d14237fdc88aac828737e739416c32c5bce3bd16',
        ],
      ],
    },
  },
};

const baseResponse = {
  version: '1',
  type: 'REST',
  endpoint: 'https://graph.facebook.com/v20.0/23848494844100489/users',
  headers: {},
  params: {
    access_token: 'ABC',
    payload: {
      schema: ['EMAIL', 'FI'],
      data: [
        [
          'b100c2ec0718fe6b4805b623aeec6710719d042ceea55f5c8135b010ec1c7b36',
          '1e14a2f476f7611a8b22bc85d14237fdc88aac828737e739416c32c5bce3bd16',
        ],
      ],
    },
  },
  body: {
    JSON: {},
    JSON_ARRAY: {},
    XML: {},
    FORM: {},
  },
  files: {},
};

describe('FB_custom_audience utils test', () => {
  describe('getDataSource function tests', () => {
    it('Should return empty datasource if type and subType are both NA', () => {
      const expectedDataSource = {};
      const dataSource = getDataSource('NA', 'NA');
      expect(dataSource).toEqual(expectedDataSource);
    });
    it('Should set subType and type if value present in destination config macthes with preset list', () => {
      const expectedDataSource = {
        type: 'EVENT_BASED',
      };
      const dataSource = getDataSource('EVENT_BASED', 'something');
      expect(dataSource).toEqual(expectedDataSource);
    });
  });

  describe('responseBuilderSimple function tests', () => {
    it('Should return correct response for add payload', () => {
      const payload = basePayload;
      payload.operationCategory = 'add';
      const expectedResponse = baseResponse;
      expectedResponse.method = 'POST';
      const response = responseBuilderSimple(payload, '23848494844100489');
      expect(response).toEqual(expectedResponse);
    });

    it('Should return correct response for delete payload', () => {
      const payload = basePayload;
      payload.operationCategory = 'remove';
      const expectedResponse = baseResponse;
      expectedResponse.method = 'DELETE';
      const response = responseBuilderSimple(payload, '23848494844100489');
      expect(response).toEqual(expectedResponse);
    });

    it('Should throw error if payload is empty', () => {
      try {
        const response = responseBuilderSimple(payload, '');
        expect(response).toEqual();
      } catch (error) {
        expect(error.message).toEqual(`payload is not defined`);
      }
    });
  });

  describe('getUpdatedDataElement function tests', () => {
    it('Should hash field if isHashRequired is set to true', () => {
      const expectedDataElement = [
        '59107c750fd5ee2758d1988f2bf12d9f110439221ebdb7997e70d6a2c1c5afda',
      ];
      let dataElement = [];
      dataElement = getUpdatedDataElement(dataElement, true, 'FN', 'some-name');
      expect(dataElement).toEqual(expectedDataElement);
    });

    it('Should not hash field if isHashRequired is set to false', () => {
      const expectedDataElement = ['some-name'];
      let dataElement = [];
      dataElement = getUpdatedDataElement(dataElement, false, 'FN', 'some-name');
      expect(dataElement).toEqual(expectedDataElement);
    });

    it('Should not hash MADID or EXTERN_ID and just pass value', () => {
      const expectedDataElement = ['some-id', 'some-ext-id'];
      let dataElement = [];
      dataElement = getUpdatedDataElement(dataElement, true, 'MADID', 'some-id');
      dataElement = getUpdatedDataElement(dataElement, true, 'EXTERN_ID', 'some-ext-id');
      expect(dataElement).toEqual(expectedDataElement);
    });

    it('Should not hash MADID or EXTERN_ID and just pass empty value if value does not exist', () => {
      const expectedDataElement = ['', ''];
      let dataElement = [];
      dataElement = getUpdatedDataElement(dataElement, true, 'MADID', '');
      dataElement = getUpdatedDataElement(dataElement, true, 'EXTERN_ID', '');
      expect(dataElement).toEqual(expectedDataElement);
    });
  });
});

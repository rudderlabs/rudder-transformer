import * as lib from '@rudderstack/integrations-lib'
// import * as lib from '@rudderstack/integrations-lib'
import MockAdapter from 'axios-mock-adapter';

export const defaultMockFns = (_: MockAdapter) => {
  const mockGenerateUUID = jest.fn().mockReturnValue('mocked-uuid')
  jest.spyOn(Object.getPrototypeOf(lib), 'generateUUID').mockImplementation(mockGenerateUUID)
};

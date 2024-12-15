import utils from '../../../../src/v0/util';

export const defaultMockFns = () => {
  jest.spyOn(utils, 'generateUUID').mockReturnValue('test-id-123-123-123');
};

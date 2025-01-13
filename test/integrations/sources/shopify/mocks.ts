import utils from '../../../../src/v0/util';

export const mockFns = (_) => {
  jest.spyOn(utils, 'generateUUID').mockReturnValue('5d3e2cb6-4011-5c9c-b7ee-11bc1e905097');
};

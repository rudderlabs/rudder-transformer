export const defaultMockFns = (_) => {
  return jest.spyOn(Date, 'now').mockReturnValue(new Date('2022-04-29T05:17:09Z').valueOf());
};

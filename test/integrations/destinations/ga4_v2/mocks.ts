export const defaultMockFns = () => {
  return jest
    .spyOn(Date, 'now')
    .mockImplementation(() => new Date('2022-04-29T05:17:09Z').valueOf());
};

export const defaultMockFns = () => {
    jest.spyOn(Date, 'now').mockImplementation(() => new Date("2023-11-12T15:46:51.000Z").valueOf());
};
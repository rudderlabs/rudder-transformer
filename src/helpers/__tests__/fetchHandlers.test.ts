import { FetchHandler } from '../fetchHandlers';
import { MiscService } from '../../services/misc';

beforeEach(() => {
  FetchHandler['sourceHandlerMap'].clear();
  FetchHandler['sourceHydrateHandlerMap'].clear();
  FetchHandler['destHandlerMap'].clear();
  FetchHandler['deletionHandlerMap'].clear();
  FetchHandler['batchDestinationHandlerMap'].clear();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('FetchHandlers Service', () => {
  test('should save the handlers in the respective maps', async () => {
    const dest = 'am';
    const source = 'source';
    const version = 'version';

    jest.spyOn(MiscService, 'getDestHandler').mockImplementation(() => ({}));
    jest.spyOn(MiscService, 'getSourceHandler').mockImplementation(() => ({}));
    jest.spyOn(MiscService, 'getDeletionHandler').mockImplementation(() => ({}));

    expect(FetchHandler['sourceHandlerMap'].get(source)).toBeUndefined();
    FetchHandler.getSourceHandler(source);
    expect(FetchHandler['sourceHandlerMap'].get(source)).toBeDefined();

    expect(FetchHandler['destHandlerMap'].get(dest)).toBeUndefined();
    FetchHandler.getDestHandler(dest, version);
    expect(FetchHandler['destHandlerMap'].get(dest)).toBeDefined();

    expect(FetchHandler['deletionHandlerMap'].get(dest)).toBeUndefined();
    FetchHandler.getDeletionHandler(dest, version);
    expect(FetchHandler['deletionHandlerMap'].get(dest)).toBeDefined();
  });

  test('delegates destination handler validation to MiscService read sites', async () => {
    const getDestHandlerSpy = jest
      .spyOn(MiscService, 'getDestHandler')
      .mockImplementation(() => ({}));
    const getDeletionHandlerSpy = jest
      .spyOn(MiscService, 'getDeletionHandler')
      .mockImplementation(() => ({}));
    const getBatchDestinationHandlerSpy = jest
      .spyOn(MiscService, 'getBatchDestinationHandler')
      .mockReturnValue({} as never);

    expect(() => FetchHandler.getDestHandler('../dest', 'v0')).not.toThrow();
    expect(() => FetchHandler.getDeletionHandler('../dest', 'v0')).not.toThrow();
    expect(() => FetchHandler.getBatchDestinationHandler('../dest')).not.toThrow();

    expect(getDestHandlerSpy).toHaveBeenCalledWith('../dest', 'v0');
    expect(getDeletionHandlerSpy).toHaveBeenCalledWith('../dest', 'v0');
    expect(getBatchDestinationHandlerSpy).toHaveBeenCalledWith('../dest');
  });
});

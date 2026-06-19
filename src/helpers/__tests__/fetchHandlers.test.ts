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

    jest.spyOn(MiscService, 'getDestHandler').mockReturnValue({});
    jest.spyOn(MiscService, 'getSourceHandler').mockReturnValue({});
    jest.spyOn(MiscService, 'getDeletionHandler').mockReturnValue({});

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

  test('should delegate destination validation to MiscService read sites', async () => {
    const error = new Error('read-site validation');
    const getDestHandlerSpy = jest.spyOn(MiscService, 'getDestHandler').mockImplementation(() => {
      throw error;
    });
    const getDeletionHandlerSpy = jest
      .spyOn(MiscService, 'getDeletionHandler')
      .mockImplementation(() => {
        throw error;
      });
    const getBatchDestinationHandlerSpy = jest
      .spyOn(MiscService, 'getBatchDestinationHandler')
      .mockImplementation(() => {
        throw error;
      });

    expect(() => FetchHandler.getDestHandler('../dest', 'v0')).toThrow(error);
    expect(getDestHandlerSpy).toHaveBeenCalledWith('../dest', 'v0');

    expect(() => FetchHandler.getDeletionHandler('../dest', 'v0')).toThrow(error);
    expect(getDeletionHandlerSpy).toHaveBeenCalledWith('../dest', 'v0');

    expect(() => FetchHandler.getBatchDestinationHandler('../dest')).toThrow(error);
    expect(getBatchDestinationHandlerSpy).toHaveBeenCalledWith('../dest');
  });
});

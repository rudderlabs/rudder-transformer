import { FetchHandler } from '../fetchHandlers';
import { MiscService } from '../../services/misc';

afterEach(() => {
  jest.clearAllMocks();
});

describe('FetchHandlers Service', () => {
  test('should save the handlers in the respective maps', async () => {
    const dest = 'dest';
    const source = 'source';
    const version = 'version';

    MiscService.getDestHandler = jest.fn().mockImplementation((dest, version) => {
      return {};
    });
    MiscService.getSourceHandler = jest.fn().mockImplementation((source, version) => {
      return {};
    });
    MiscService.getDeletionHandler = jest.fn().mockImplementation((source, version) => {
      return {};
    });

    expect(FetchHandler['sourceHandlerMap'].get(dest)).toBeUndefined();
    FetchHandler.getSourceHandler(dest, version);
    expect(FetchHandler['sourceHandlerMap'].get(dest)).toBeDefined();

    expect(FetchHandler['destHandlerMap'].get(dest)).toBeUndefined();
    FetchHandler.getDestHandler(dest, version);
    expect(FetchHandler['destHandlerMap'].get(dest)).toBeDefined();

    expect(FetchHandler['deletionHandlerMap'].get(dest)).toBeUndefined();
    FetchHandler.getDeletionHandler(dest, version);
    expect(FetchHandler['deletionHandlerMap'].get(dest)).toBeDefined();
  });
});

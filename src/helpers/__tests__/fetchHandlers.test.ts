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
    MiscService.getSourceHandler = jest.fn().mockImplementation((source) => {
      return {};
    });
    MiscService.getDeletionHandler = jest.fn().mockImplementation((source, version) => {
      return {};
    });

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
});

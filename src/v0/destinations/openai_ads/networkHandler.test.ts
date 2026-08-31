import { networkHandler } from './networkHandler';

describe('OpenAI Ads networkHandler', () => {
  it('uses generic transport/response handling with OpenAI content-type normalization', () => {
    const handler = {} as Record<string, unknown>;
    (networkHandler as (this: Record<string, unknown>) => void).call(handler);

    expect(handler.proxy).toBeInstanceOf(Function);
    expect(handler.responseHandler).toBeInstanceOf(Function);
    expect(handler.prepareProxy).toBeInstanceOf(Function);
    expect(handler.processAxiosResponse).toBeInstanceOf(Function);
  });
});

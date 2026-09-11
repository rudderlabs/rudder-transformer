import { runDeleteUsersStep } from './runDeleteUsersStep';
import { RunContextImpl } from './runContext';
import type { DeleteUsersStep, LiveHttpResponse, RunContext } from './types';

const ctx = (): RunContext =>
  new RunContextImpl({ liveSecret: { authType: 'apiKey', config: {} } });

const deleteUserStep: DeleteUsersStep = {
  stepType: 'deleteUsers',
  name: 'delete a user',
  userAttributes: (runCtx) => [{ userId: runCtx.identity('user') }],
};

const httpReturning = (response: LiveHttpResponse) => ({
  post: jest.fn().mockResolvedValue(response),
});

describe('runDeleteUsersStep', () => {
  const failedResponses = [
    {
      name: 'a failed deletion',
      response: {
        status: 409,
        body: [{ statusCode: 409, error: 'User deletion request failed' }],
      },
    },
    {
      name: 'a 200 whose job entry is not successful',
      response: {
        status: 200,
        body: [{ statusCode: 500, error: 'User deletion request failed' }],
      },
    },
  ];

  it('posts one regulation-worker job with the step config and passes when it succeeds', async () => {
    const runCtx = ctx();
    const http = httpReturning({
      status: 200,
      body: [{ statusCode: 200, status: 'successful' }],
    });

    await runDeleteUsersStep({
      destination: 'mp',
      step: deleteUserStep,
      ctx: runCtx,
      config: { token: 'project-token' },
      http,
    });

    expect(http.post).toHaveBeenCalledWith('/deleteUsers', [
      {
        jobId: expect.stringMatching(/^\d+$/),
        destType: 'mp',
        config: { token: 'project-token' },
        userAttributes: [{ userId: runCtx.identity('user') }],
      },
    ]);
  });

  it.each(failedResponses)('fails the step on $name', async ({ response }) => {
    await expect(
      runDeleteUsersStep({
        destination: 'mp',
        step: deleteUserStep,
        ctx: ctx(),
        config: {},
        http: httpReturning(response),
      }),
    ).rejects.toThrow(/User deletion request failed/);
  });

  it('rejects a step that names no users, before any request', async () => {
    const http = httpReturning({ status: 200, body: [] });

    await expect(
      runDeleteUsersStep({
        destination: 'mp',
        step: { ...deleteUserStep, userAttributes: () => [] },
        ctx: ctx(),
        config: {},
        http,
      }),
    ).rejects.toThrow('the step named no users to delete');
    expect(http.post).not.toHaveBeenCalled();
  });
});

import { HttpStatusCode } from 'axios';
import { randomInt } from 'crypto';
import type { RunDeleteUsersStepParams } from './types';

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

// Sends one user-deletion job to /deleteUsers, shaped like the regulation-worker's request
// (rudder-server regulation-worker/internal/delete/api mapJobToPayload), and asserts the
// transformer reports it successful.
export const runDeleteUsersStep = async ({
  destination,
  step,
  ctx,
  config,
  http,
}: RunDeleteUsersStepParams): Promise<void> => {
  if (step.delayBeforeMs) {
    await sleep(step.delayBeforeMs);
  }
  const userAttributes = step.userAttributes(ctx);
  if (userAttributes.length === 0) {
    throw new Error(`[live:${destination}:${step.name}] the step named no users to delete`);
  }
  const response = await http.post('/deleteUsers', [
    {
      jobId: String(randomInt(1, 2_147_483_647)),
      destType: destination,
      config,
      userAttributes,
    },
  ]);
  // One entry per job: { statusCode, status } on success, { statusCode, error } on failure. The
  // whole response is asserted so a failure prints the transformer's error.
  expect({ status: response.status, body: response.body }).toEqual({
    status: HttpStatusCode.Ok,
    body: [{ statusCode: HttpStatusCode.Ok, status: 'successful' }],
  });
};

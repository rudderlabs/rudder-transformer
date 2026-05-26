import { Context } from 'koa';
import { formatZodError } from '@rudderstack/integrations-lib';
import { z } from 'zod';
import { EventTesterService } from '../services/eventTest/eventTester';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CatchErr, FixMe } from '../types';
import { sandboxedParseTemplate } from '../v0/destinations/custom_audience/template/templateSandboxClient';

const parseTemplateBodySchema = z.object({
  requestBody: z.string().min(1, 'requestBody must be a non-empty string'),
  workspaceId: z.string().min(1, 'workspaceId must be a non-empty string'),
});

const testEventV2Schema = z.object({
  events: z.array(z.record(z.unknown())),
  destination: z.record(z.unknown()),
  connection: z.record(z.unknown()),
  stage: z.object({
    user_transform: z.boolean(),
    dest_transform: z.boolean(),
    send_to_destination: z.boolean(),
  }),
  libraries: z.array(z.record(z.unknown())),
});

export class EventTestController {
  private static API_VERSION = '1';

  public static async testEvent(ctx: Context) {
    const { version, destination }: { version: string; destination: string } = ctx.params as any;
    const { events }: { events: FixMe } = ctx.request.body as FixMe;
    try {
      const respList = await EventTesterService.testEvent(events, version, destination);
      ctx.body = respList;
    } catch (err: CatchErr) {
      // fail-safety error response
      ctx.body = {
        error: err.message || JSON.stringify(err),
      };
      ctx.status = 400;
    }
    ctx.set('apiVersion', EventTestController.API_VERSION);
  }

  public static async testEventV2(ctx: Context) {
    const { version, destination }: { version: string; destination: string } = ctx.params as any;
    const parsed = testEventV2Schema.safeParse(ctx.request.body);
    if (!parsed.success) {
      ctx.status = 400;
      ctx.body = { error: formatZodError(parsed.error) };
      ctx.set('apiVersion', EventTestController.API_VERSION);
      return;
    }

    try {
      ctx.body = await EventTesterService.testEventV2(parsed.data, version, destination);
    } catch (err: CatchErr) {
      ctx.body = {
        error: err.message || JSON.stringify(err),
      };
      ctx.status = 400;
    }
    ctx.set('apiVersion', EventTestController.API_VERSION);
  }

  public static status(ctx: Context) {
    ctx.status = 200;
    ctx.body = 'OK';
  }

  public static async parseCustomAudienceTemplate(ctx: Context) {
    const parsed = parseTemplateBodySchema.safeParse(ctx.request.body);
    if (!parsed.success) {
      ctx.status = 400;
      ctx.body = { error: formatZodError(parsed.error) };
      return;
    }
    ctx.body = await sandboxedParseTemplate(parsed.data.requestBody, parsed.data.workspaceId);
  }
}

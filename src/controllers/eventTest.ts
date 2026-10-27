import { Context } from 'koa';
import { formatZodError } from '@rudderstack/integrations-lib';
import { z } from 'zod';
import { EventTesterService } from '../services/eventTest/eventTester';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CatchErr, FixMe } from '../types';
import { RecordAction } from '../types/rudderEvents';
import {
  sandboxedParseTemplate,
  sandboxedParseHttpTemplates,
} from '../v0/destinations/custom_audience/template/templateSandboxClient';
import { requestFieldExpression } from '../v0/destinations/http/requestFields';
import {
  actionConfigSchema,
  CustomAudienceDestConfig,
} from '../v0/destinations/custom_audience/types';
import { lookupActionConfig } from '../v0/destinations/custom_audience/utils';

const parseTemplateActionConfigSchema = actionConfigSchema
  .partial()
  .extend({ requestBody: actionConfigSchema.shape.requestBody });

const parseTemplateUpdateActionConfigSchema = z.union([
  parseTemplateActionConfigSchema.extend({ useInsertConfig: z.boolean().optional() }),
  z.object({ useInsertConfig: z.literal(true) }),
]);

const parseTemplateActionsSchema = z.object({
  insert: parseTemplateActionConfigSchema.optional(),
  update: parseTemplateUpdateActionConfigSchema.optional(),
  delete: parseTemplateActionConfigSchema.optional(),
});

const parseTemplateBodySchema = z.object({
  action: z.nativeEnum(RecordAction),
  actions: parseTemplateActionsSchema,
  workspaceId: z.string().min(1, 'workspaceId must be a non-empty string'),
});

const MAX_HTTP_TEMPLATE_LENGTH = 16_384;
const MAX_HTTP_REQUEST_FIELDS = 100;
const MAX_HTTP_TEMPLATE_TOTAL_LENGTH = 65_536;
const httpParseBodySchema = z
  .object({
    workspaceId: z.string().min(1),
    requestBodyTemplate: z.string().max(MAX_HTTP_TEMPLATE_LENGTH),
    headers: z
      .array(z.object({ from: z.string().max(MAX_HTTP_TEMPLATE_LENGTH) }))
      .max(MAX_HTTP_REQUEST_FIELDS)
      .optional(),
    queryParams: z
      .array(z.object({ from: z.string().max(MAX_HTTP_TEMPLATE_LENGTH) }))
      .max(MAX_HTTP_REQUEST_FIELDS)
      .optional(),
    pathParams: z
      .array(z.object({ path: z.string().max(MAX_HTTP_TEMPLATE_LENGTH) }))
      .max(MAX_HTTP_REQUEST_FIELDS)
      .optional(),
  })
  .refine(
    ({ requestBodyTemplate, headers = [], queryParams = [], pathParams = [] }) =>
      headers.length + queryParams.length + pathParams.length <= MAX_HTTP_REQUEST_FIELDS &&
      requestBodyTemplate.length +
        headers.reduce((n, { from }) => n + from.length, 0) +
        queryParams.reduce((n, { from }) => n + from.length, 0) +
        pathParams.reduce((n, { path }) => n + path.length, 0) <=
        MAX_HTTP_TEMPLATE_TOTAL_LENGTH,
    { message: 'Too many request fields or too much template input' },
  );

const testEventV2Schema = z.object({
  events: z.array(z.record(z.unknown())),
  destination: z.record(z.unknown()),
  connection: z.record(z.unknown()).optional(),
  stage: z.object({
    user_transform: z.boolean().optional(),
    dest_transform: z.boolean().optional(),
    send_to_destination: z.boolean().optional(),
  }),
  libraries: z.array(z.record(z.unknown())).optional(),
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
    const { version, destination } = ctx.params;
    const parsed = testEventV2Schema.safeParse(ctx.request.body);
    if (!parsed.success) {
      ctx.status = 400;
      ctx.body = { error: formatZodError(parsed.error) };
      return;
    }

    ctx.body = await EventTesterService.testEventV2(parsed.data, version, destination);
  }

  public static status(ctx: Context) {
    ctx.status = 200;
    ctx.body = 'OK';
  }

  public static async parseHttpTemplate(ctx: Context) {
    const parsed = httpParseBodySchema.safeParse(ctx.request.body);
    if (!parsed.success) {
      ctx.status = 400;
      ctx.body = { error: formatZodError(parsed.error) };
      return;
    }
    const {
      workspaceId,
      requestBodyTemplate,
      headers = [],
      queryParams = [],
      pathParams = [],
    } = parsed.data;
    const fields = [
      { field: 'requestBodyTemplate', template: requestBodyTemplate },
      ...headers.map(({ from }, index) => ({
        field: 'headers',
        index,
        template: requestFieldExpression(from),
      })),
      ...queryParams.map(({ from }, index) => ({
        field: 'queryParams',
        index,
        template: requestFieldExpression(from),
      })),
      ...pathParams.map(({ path }, index) => ({
        field: 'pathParams',
        index,
        template: requestFieldExpression(path),
      })),
    ];
    // A single bounded isolate call validates all surfaces while preserving their indices.
    const results = await sandboxedParseHttpTemplates(
      fields.map(({ template }) => template),
      workspaceId,
    );
    const errors = results.flatMap((result, i) =>
      result.valid
        ? []
        : [
            {
              field: fields[i].field,
              ...('index' in fields[i] ? { index: fields[i].index } : {}),
              messages: result.errors,
            },
          ],
    );
    ctx.body = { valid: errors.length === 0, errors };
  }

  public static async parseCustomAudienceTemplate(ctx: Context) {
    const parsed = parseTemplateBodySchema.safeParse(ctx.request.body);
    if (!parsed.success) {
      ctx.status = 400;
      ctx.body = { error: formatZodError(parsed.error) };
      return;
    }
    const { action, actions, workspaceId } = parsed.data;
    const { config: actionConfig } = lookupActionConfig(
      action,
      actions as CustomAudienceDestConfig['actions'],
    );
    ctx.body = await sandboxedParseTemplate(actionConfig.requestBody, workspaceId);
  }
}

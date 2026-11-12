import { Context } from 'koa';
import { formatZodError } from '@rudderstack/integrations-lib';
import { z } from 'zod';
import { EventTesterService } from '../services/eventTest/eventTester';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CatchErr, FixMe } from '../types';
import { RecordAction } from '../types/rudderEvents';
import { sandboxedParseTemplate } from '../v0/destinations/custom_audience/template/templateSandboxClient';
import { sandboxedParseHttpTemplates } from '../v0/destinations/http/templateSandboxClient';
import { requestFieldExpression } from '../v0/destinations/http/utils';
import { MAX_EVENT_OVERRIDES } from '../v0/destinations/http/types';
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

// Bound template count and size before copying them into the sandbox.
const MAX_HTTP_PARSE_FIELDS = 100;
const MAX_HTTP_PARSE_TEMPLATES = 500;
const MAX_HTTP_PARSE_TEMPLATE_LENGTH = 10_000;
const httpParseTemplate = z.string().max(MAX_HTTP_PARSE_TEMPLATE_LENGTH);
const httpMappingsSchema = z
  .array(z.object({ from: httpParseTemplate }))
  .max(MAX_HTTP_PARSE_FIELDS)
  .optional();
const httpPathParamsSchema = z
  .array(z.object({ path: httpParseTemplate }))
  .max(MAX_HTTP_PARSE_FIELDS)
  .optional();
const httpParseBodySchema = z.object({
  workspaceId: z.string().min(1, 'workspaceId must be a non-empty string'),
  requestBodyTemplate: httpParseTemplate,
  headers: httpMappingsSchema,
  queryParams: httpMappingsSchema,
  pathParams: httpPathParamsSchema,
  eventOverrides: z
    .array(
      z.object({
        pathParams: httpPathParamsSchema,
        queryParams: httpMappingsSchema,
        requestBodyTemplate: httpParseTemplate.optional(),
      }),
    )
    .max(MAX_EVENT_OVERRIDES)
    .optional(),
});

// The templates parse-template verifies, labelled with the `field`/`index`/`group` it reports.
// Each request field goes through requestFieldExpression, exactly as the router evaluates it.
const verificationFields = (body: z.infer<typeof httpParseBodySchema>) => {
  const surface = (field: string, values: string[], group?: number) =>
    values.map((value, index) => ({
      field,
      index,
      group,
      template: requestFieldExpression(value),
    }));
  const fields = (
    config: Partial<
      Pick<typeof body, 'requestBodyTemplate' | 'headers' | 'queryParams' | 'pathParams'>
    >,
    group?: number,
  ) => [
    ...(config.requestBodyTemplate === undefined
      ? []
      : [
          {
            field: 'requestBodyTemplate',
            index: undefined,
            group,
            template: config.requestBodyTemplate as string,
          },
        ]),
    ...surface(
      'headers',
      (config.headers ?? []).map(({ from }) => from),
      group,
    ),
    ...surface(
      'queryParams',
      (config.queryParams ?? []).map(({ from }) => from),
      group,
    ),
    ...surface(
      'pathParams',
      (config.pathParams ?? []).map(({ path }) => path),
      group,
    ),
  ];
  return [
    ...fields(body),
    ...(body.eventOverrides ?? []).flatMap((config, group) => fields(config, group)),
  ];
};

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
    const fields = verificationFields(parsed.data);
    if (fields.length > MAX_HTTP_PARSE_TEMPLATES) {
      ctx.status = 400;
      ctx.body = {
        error: `HTTP parse-template accepts at most ${MAX_HTTP_PARSE_TEMPLATES} fields`,
      };
      return;
    }
    // A single isolate call validates all surfaces while preserving their indices.
    const results = await sandboxedParseHttpTemplates(
      fields.map(({ template }) => template),
      parsed.data.workspaceId,
    );
    const errors = results.flatMap((result, i) =>
      result.valid
        ? []
        : [
            {
              field: fields[i].field,
              index: fields[i].index,
              group: fields[i].group,
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

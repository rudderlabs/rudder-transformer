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
import { MAX_EVENT_OVERRIDES, MAX_OVERRIDE_EVENTS } from '../v0/destinations/http/types';
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
  .array(z.object({ from: httpParseTemplate.optional() }))
  .max(MAX_HTTP_PARSE_FIELDS)
  .optional();
const httpPathParamsSchema = z
  .array(z.object({ path: httpParseTemplate.optional() }))
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
        name: z.string().optional(),
        events: z.array(z.string()).max(MAX_OVERRIDE_EVENTS).optional(),
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
  const surface = (field: string, values: (string | undefined)[], group?: number) =>
    values.map((value, index) => ({
      field,
      index,
      group,
      template: typeof value === 'string' ? requestFieldExpression(value) : undefined,
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

type HttpParseError = { field: string; index?: number; group?: number; messages: string[] };

// The router sends an event to the first group listing it, so a later group listing it never applies.
const duplicateEventErrors = (
  eventOverrides: z.infer<typeof httpParseBodySchema>['eventOverrides'],
): HttpParseError[] => {
  const firstGroups = new Map<string, number>();
  return (eventOverrides ?? []).flatMap(({ events }, group) =>
    [...new Set(events)].flatMap((event) => {
      const firstGroup = firstGroups.get(event);
      if (firstGroup === undefined) {
        firstGroups.set(event, group);
        return [];
      }
      return [
        {
          field: 'events',
          group,
          messages: [`event "${event}" is already in eventOverrides[${firstGroup}]`],
        },
      ];
    }),
  );
};

// One line per error, for callers that only show text (config-backend's save validation).
const errorMessage = (
  errors: HttpParseError[],
  eventOverrides: z.infer<typeof httpParseBodySchema>['eventOverrides'],
) =>
  errors
    .map(({ field, index, group, messages }) => {
      const name = typeof group === 'number' ? eventOverrides?.[group]?.name : undefined;
      const prefix =
        group === undefined ? '' : `eventOverrides[${group}]${name ? ` "${name}"` : ''}.`;
      return `${prefix}${index === undefined ? field : `${field}[${index}]`}: ${messages.join('; ')}`;
    })
    .join(', ');

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
    const { workspaceId, eventOverrides } = parsed.data;
    const present = fields.filter(
      (field): field is (typeof fields)[number] & { template: string } =>
        field.template !== undefined,
    );
    // A single isolate call validates all surfaces while preserving their indices.
    const results = await sandboxedParseHttpTemplates(
      present.map(({ template }) => template),
      workspaceId,
    );
    const errors: HttpParseError[] = [
      ...fields
        .filter(({ template }) => template === undefined)
        .map(({ field, index, group }) => ({ field, index, group, messages: ['is required'] })),
      ...present.flatMap(({ field, index, group }, i) => {
        const result = results[i];
        return result.valid ? [] : [{ field, index, group, messages: result.errors }];
      }),
      ...duplicateEventErrors(eventOverrides),
    ];
    ctx.body = {
      valid: errors.length === 0,
      errors,
      ...(errors.length > 0 && { message: errorMessage(errors, eventOverrides) }),
    };
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

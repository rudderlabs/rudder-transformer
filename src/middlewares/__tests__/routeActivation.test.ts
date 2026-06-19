import { Context, Next } from 'koa';

const ROUTE_DISABLED_MESSAGE = 'RouteActivationMiddleware route is disabled';

type RouteActivationMiddlewareType = typeof import('../routeActivation').RouteActivationMiddleware;

const originalEnv = { ...process.env };

const loadRouteActivationMiddleware = (
  envOverrides: Record<string, string | undefined> = {},
): RouteActivationMiddlewareType => {
  jest.resetModules();
  process.env = { ...originalEnv };

  Object.entries(envOverrides).forEach(([key, value]) => {
    if (value === undefined) {
      delete process.env[key];
      return;
    }
    process.env[key] = value;
  });

  return jest.requireActual('../routeActivation').RouteActivationMiddleware;
};

const mockCtx = (params: Record<string, string> = {}) =>
  ({
    params,
    status: undefined,
    body: undefined,
  }) as unknown as Context;

const expectRouteEnabled = (route: (ctx: Context, next: Next) => unknown, ctx = mockCtx()) => {
  const next = jest.fn();

  route(ctx, next);

  expect(next).toHaveBeenCalledTimes(1);
  expect(ctx.status).toBeUndefined();
  expect(ctx.body).toBeUndefined();
};

const expectRouteDisabled = (route: (ctx: Context, next: Next) => unknown, ctx = mockCtx()) => {
  const next = jest.fn();

  route(ctx, next);

  expect(next).not.toHaveBeenCalled();
  expect(ctx.status).toBe(404);
  expect(ctx.body).toBe(ROUTE_DISABLED_MESSAGE);
};

describe('RouteActivationMiddleware', () => {
  afterEach(() => {
    process.env = { ...originalEnv };
    jest.resetModules();
  });

  describe('transformer mode activation', () => {
    const modeCases = [
      { name: 'default mode', env: undefined, destinationActive: true, sourceActive: true },
      {
        name: 'destination mode',
        env: 'destination',
        destinationActive: true,
        sourceActive: false,
      },
      { name: 'source mode', env: 'source', destinationActive: false, sourceActive: true },
    ];

    it.each(modeCases)(
      'activates expected routes in $name',
      ({ env, destinationActive, sourceActive }) => {
        const Middleware = loadRouteActivationMiddleware({ TRANSFORMER_MODE: env });

        const assertDestination = destinationActive ? expectRouteEnabled : expectRouteDisabled;
        const assertSource = sourceActive ? expectRouteEnabled : expectRouteDisabled;

        assertDestination(Middleware.isDestinationRouteActive);
        assertSource(Middleware.isSourceRouteActive);
      },
    );
  });

  it('allows only active source route versions', () => {
    const Middleware = loadRouteActivationMiddleware();

    expectRouteEnabled(Middleware.isSourceRouteVersionActive, mockCtx({ version: 'v2' }));
    expectRouteDisabled(Middleware.isSourceRouteVersionActive, mockCtx({ version: 'v1' }));
  });

  it('keeps delivery routes active while delivery test routes require test mode', () => {
    const Middleware = loadRouteActivationMiddleware({
      TRANSFORMER_DELIVERY_TEST_ENABLED: 'false',
    });

    expectRouteEnabled(Middleware.isDeliveryRouteActive);
    expectRouteDisabled(Middleware.isDeliveryTestRouteActive);
  });

  it('activates delivery test routes when delivery test mode is enabled', () => {
    const Middleware = loadRouteActivationMiddleware({
      TRANSFORMER_DELIVERY_TEST_ENABLED: 'true',
    });

    expectRouteEnabled(Middleware.isDeliveryTestRouteActive);
  });

  it('disables user transform routes when functions are disabled', () => {
    const Middleware = loadRouteActivationMiddleware({
      ENABLE_FUNCTIONS: 'false',
    });

    expectRouteDisabled(Middleware.isUserTransformRouteActive);
  });

  it('activates user transform test routes only in transformer test mode', () => {
    const DisabledMiddleware = loadRouteActivationMiddleware({
      TRANSFORMER_TEST_MODE: 'false',
    });
    expectRouteDisabled(DisabledMiddleware.isUserTransformTestRouteActive);

    const EnabledMiddleware = loadRouteActivationMiddleware({
      TRANSFORMER_TEST_MODE: 'true',
    });
    expectRouteEnabled(EnabledMiddleware.isUserTransformTestRouteActive);
  });
});

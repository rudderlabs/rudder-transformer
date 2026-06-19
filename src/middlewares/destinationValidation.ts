import fs from 'fs';
import path from 'path';
import { Context, Next } from 'koa';
import {
  DestHandlerMap,
  WhitelistOnlyDestinationAliases,
} from '../constants/destinationCanonicalNames';

interface DestinationRegistryEntry {
  name: string;
  aliases: string[];
  handler?: string;
}

const repoRoot = path.resolve(__dirname, '..');
const destinationRoots = [
  path.join(repoRoot, 'v0', 'destinations'),
  path.join(repoRoot, 'v1', 'destinations'),
  path.join(repoRoot, 'cdk', 'v2', 'destinations'),
];

export const normalizeDestinationName = (destination: string) => destination.trim().toLowerCase();

const getDestinationDirectories = () =>
  destinationRoots.flatMap((destinationRoot) => {
    try {
      return fs
        .readdirSync(destinationRoot, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name);
    } catch {
      return [];
    }
  });

export const destinationRegistry: Record<string, DestinationRegistryEntry> = Object.create(null);

const hasDestination = (destination: string) =>
  Object.prototype.hasOwnProperty.call(destinationRegistry, destination);

const buildDestinationEntry = (key: string): DestinationRegistryEntry => ({
  name: key,
  aliases: [],
});

getDestinationDirectories().forEach((destination) => {
  const key = normalizeDestinationName(destination);
  destinationRegistry[key] = destinationRegistry[key] || buildDestinationEntry(key);
});

Object.entries(DestHandlerMap).forEach(([alias, destination]) => {
  const key = normalizeDestinationName(alias);
  const handler = normalizeDestinationName(destination);
  if (!hasDestination(handler)) {
    throw new Error(
      `Destination handler alias ${alias} points to unknown destination: ${destination}`,
    );
  }
  destinationRegistry[key] = {
    ...(destinationRegistry[key] || buildDestinationEntry(key)),
    handler,
  };
});

Object.entries(WhitelistOnlyDestinationAliases).forEach(([alias, destination]) => {
  const key = normalizeDestinationName(alias);
  const canonicalDestination = normalizeDestinationName(destination);
  if (!hasDestination(canonicalDestination)) {
    throw new Error(
      `Destination whitelist alias ${alias} points to unknown destination: ${destination}`,
    );
  }
  destinationRegistry[key] = destinationRegistry[key] || buildDestinationEntry(key);
});

export const isValidDestination = (destination: unknown): destination is string =>
  typeof destination === 'string' &&
  destination.length > 0 &&
  hasDestination(normalizeDestinationName(destination));

export const assertValidDestination = (destination: unknown) => {
  if (!isValidDestination(destination)) {
    const error = new Error(`Invalid destination: ${destination}`) as Error & {
      status?: number;
      statusCode?: number;
      isRetryable?: boolean;
    };
    error.status = 400;
    error.statusCode = 400;
    error.isRetryable = false;
    throw error;
  }
};

export const getDestinationHandlerName = (destination: string) => {
  assertValidDestination(destination);
  const normalized = normalizeDestinationName(destination);
  return destinationRegistry[normalized].handler || normalized;
};

const invalidDestinationResponse = (ctx: Context, destination: string) => {
  ctx.status = 400;
  ctx.body = { error: `Invalid destination: ${destination}` };
};

const validateDestination = (ctx: Context, destination: unknown): boolean => {
  if (typeof destination === 'string' && isValidDestination(destination)) {
    return true;
  }
  invalidDestinationResponse(ctx, String(destination));
  return false;
};

export class DestinationValidationMiddleware {
  public static async pathParam(ctx: Context, next: Next) {
    if (!validateDestination(ctx, ctx.params.destination)) {
      return;
    }
    await next();
  }

  public static async bodyDestType(ctx: Context, next: Next) {
    const body = ctx.request.body as { destType?: unknown };
    if (!validateDestination(ctx, body?.destType)) {
      return;
    }
    await next();
  }

  public static async userDeletionBody(ctx: Context, next: Next) {
    const requests = ctx.request.body;
    const userDeletionRequests = Array.isArray(requests)
      ? (requests as Array<{ destType?: unknown } | null | undefined>)
      : [];
    const invalidRequestIndex = userDeletionRequests.findIndex(
      (request) => !isValidDestination(request?.destType),
    );
    const destination =
      invalidRequestIndex >= 0
        ? userDeletionRequests[invalidRequestIndex]?.destType
        : userDeletionRequests[0]?.destType;
    if (!validateDestination(ctx, destination)) {
      return;
    }
    await next();
  }
}

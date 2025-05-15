import type * as Koa from 'koa';
import { Piscina } from 'piscina';
import getRawBody from 'raw-body';
import inflate from 'inflation';
import path from 'path';
import * as contentTypeParser from 'content-type';
import { ParseResult } from './piscinaBodyParserWorker';
import logger from '../logger';

class BodyParserError extends Error {
  name: string;

  status: number;

  constructor(message: string, name: string, status: number) {
    super(message);
    this.name = name;
    this.status = status;

    // Necessary when extending built-in classes
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// Create the Piscina worker pool
const testEnv = process.env.NODE_ENV === 'test';

/**
 * Middleware wrapper which delegate options to the core code
 */
export function piscinaJsonBodyParser(): (ctx: Koa.Context, next: Koa.Next) => Promise<void> {
  logger.info('Using piscina json body parser');
  const piscina = new Piscina({
    filename: path.resolve(__dirname, `piscinaBodyParserWorker${testEnv ? '.ts' : '.js'}`),
    execArgv: testEnv ? ['-r', 'ts-node/register'] : undefined,
    minThreads: 4,
    maxThreads: 4,
    // concurrentTasksPerWorker: 1,
    // atomics: 'sync',
  });
  const parsedMethods = ['POST', 'PUT', 'PATCH'];
  const supportedContentTypes = [
    'application/json',
    'application/json-patch+json',
    'application/vnd.api+json',
    'application/csp-report',
    'application/reports+json',
    'application/scim+json',
  ];

  async function parseJsonRequest(ctx: Koa.Context): Promise<{ parsed: any }> {
    const rawBody = (await getRawBody(inflate(ctx.req), {
      encoding: null, // gets body as Buffer
      limit: '200mb',
      length: ctx.req.headers['content-length'],
    })) as Buffer;

    const result = (await piscina.run(
      { buffer: rawBody.buffer },
      {
        transferList: [rawBody.buffer as ArrayBuffer], // don't copy the buffer, transfer it
      },
    )) as ParseResult;

    if (result.error) {
      const err = new BodyParserError(result.error.message, result.error.name, result.error.status);
      throw err;
    } else {
      return {
        parsed: result.parsed,
      };
    }
  }

  // eslint-disable-next-line func-names
  return async function jsonBodyParser(ctx: Koa.Context, next: Koa.Next) {
    let contentType: string;
    try {
      contentType = contentTypeParser.parse(ctx.req.headers['content-type'] || '').type;
    } catch (e) {
      contentType = '';
    }
    if (
      // method souldn't be parsed
      !parsedMethods.includes(ctx.method.toUpperCase()) ||
      // content type not supported
      !supportedContentTypes.includes(contentType) ||
      // koa request body already parsed
      ctx.request.body !== undefined ||
      // bodyparser disabled
      ctx.disableBodyParser
    ) {
      await next();
      return;
    }
    if (ctx.req.closed) {
      ctx.status = 499;
      ctx.body = 'Request already closed';
      return;
    }
    const response = await parseJsonRequest(ctx);
    // patch koa
    ctx.request.body = response.parsed;
    await next();
  };
}

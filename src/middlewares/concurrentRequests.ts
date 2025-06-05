import { Middleware } from 'koa';
import stats from '../util/stats';

/**
 * Middleware to track and log the number of concurrent HTTP requests.
 *
 * This middleware increments a counter each time a request is received and decrements it
 * when the request is completed. It periodically logs the current number of concurrent
 * requests using the `stats.gauge` method every 10 seconds.
 *
 * @returns {Middleware} An async middleware function compatible with Koa or similar frameworks.
 */
export function concurrentRequests(): Middleware {
  let concurrent = 0;
  let lastLogged = Date.now();
  const statsInterval = 10 * 1000; // 10 seconds

  return async (ctx, next) => {
    concurrent += 1;
    if (Date.now() - lastLogged > statsInterval) {
      stats.gauge('http_concurrent_requests', concurrent);
      lastLogged = Date.now();
    }
    try {
      await next();
    } finally {
      concurrent -= 1;
    }
  };
}

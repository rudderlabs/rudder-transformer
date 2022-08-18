const util = require("util");
const moment = require("moment");

// process's pid, date, method, path, http version, status and length
const LOG_FORMAT = '[pid-%s] - - [%s] "%s %s HTTP/%s" %d %s %s %s\n';
const DATE_FORMAT = "DD/MM/YYYY:HH:mm:sssss";

module.exports = stream => {
  return async function accesslog(ctx, next) {
    try {
      await next();
    } catch (error) {
      let msgMetadatas = [];
      if (ctx.request.body) {
        const events = ctx.request.body;
        if (Array.isArray(events)) {
          msgMetadatas = events.map(({message, metadata}) => ({ message, metadata }));
        } else if (typeof events === 'object') {
          msgMetadatas = [ {message: events.message, metadata: events.metadata} ];
        }
      }
      (stream || process.stdout).write(
        util.format(
          LOG_FORMAT,
          process.pid,
          moment().format(DATE_FORMAT),
          ctx.method,
          ctx.path,
          ctx.req.httpVersion,
          ctx.status,
          ctx.length ? ctx.length.toString() : "-",
          error,
          JSON.stringify(msgMetadatas)
        )
      );
      // Returning data to the requested client
      ctx.status = error.status || 500;
      ctx.body = error.message;
    }
  };
};

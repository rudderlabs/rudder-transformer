const util = require("util");
const moment = require("moment");

// process's pid, date, method, path, http version, status and length
const LOG_FORMAT = '[pid-%s] - - [%s] "%s %s HTTP/%s" %d %s\n';
const DATE_FORMAT = "dd/mm/yyyy:HH:mm:sssss";

module.exports = stream => {
  return async function accesslog(ctx, next) {
    await next();

    (stream || process.stdout).write(
      util.format(
        LOG_FORMAT,
        process.pid,
        moment().format(DATE_FORMAT),
        ctx.method,
        ctx.path,
        ctx.req.httpVersion,
        ctx.status,
        ctx.length ? ctx.length.toString() : "-"
      )
    );
  };
};

var Router = require('@koa/router');

const Piscina = require('piscina');
const path = require('path');
const logger = require('../logger');

const router = new Router();
const piscina = new Piscina({
  filename: path.resolve(__dirname, '../services/piscinaUserTransform.js'),
  maxThreads: parseInt(process.env.MAX_THREADS || '6', 10),
});

async function transform(ctx) {
  const events = ctx.request.body;
  const processedResponse = await piscina.run({ events });

  ctx.body = processedResponse.transformedEvents;
  logger.debug(
    '(User transform - router:/customTransform ):: Response from transformer',
    ctx.response.body,
  );
  return ctx;
}

router.post('/customTransform', transform);
module.exports = router.routes();

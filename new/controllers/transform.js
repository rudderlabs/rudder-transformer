const { transformRoutine } = require('../services/transform');

/**
 * Controller function to handle the /customTransform endpoint
 * Reads the raw request body and calls the transform service
 */
async function transformRaw(ctx) {
  const requestSize = ctx.state.requestSize || Number(ctx.request.get('content-length'));

  // Read the raw request body as a string
  const body = await new Promise((resolve, reject) => {
    let data = '';
    ctx.req.setEncoding('utf8');
    ctx.req.on('data', chunk => {
      data += chunk;
    });
    ctx.req.on('end', () => resolve(data));
    ctx.req.on('error', err => reject(err));
  });

  try {
    // Process the request
    const processedResponse = await transformRoutine(body, ctx.state.features, requestSize);

    // Set the response
    ctx.body = processedResponse.transformedEvents;
    ctx.status = processedResponse.retryStatus || 200;

    // TODO use proper logging
    // console.log('(User transform - router:/customTransform ):: Response from transformer');
  } catch (error) {
    console.error('Error processing transform request:', error);
    ctx.status = 500;
    ctx.body = { error: error.message || 'Internal Server Error' };
  }

  return ctx;
}

module.exports = {
  transformRaw
};
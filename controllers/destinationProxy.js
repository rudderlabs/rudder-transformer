class DestProxyController {
  static handleProxyTestRequest = async (destination, ctx) => {
    const { transformerResponse, destinationRequest } = ctx.request.body;
    // TODO: Add logic here
    ctx.status = 200;
    return ctx.body;
  };
}

module.exports = { DestProxyController };

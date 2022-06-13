class DestProxyController {
  static handleProxyTestRequest = async (ctx) => {
    const destination = ctx.params.destination;
    const { transformerResponse, destinationRequest } = ctx.request.body;
    ctx.status = 200;
    return ctx.body;
  };
}

module.exports = { DestProxyController };

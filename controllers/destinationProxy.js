const networkHandlerFactory = require('../adapters/networkHandlerFactory');
const { getPayloadData } = require("../adapters/network");
const { TRANSFORMER_METRIC } = require("../v0/util/constant");
const {
  generateErrorObject,
} = require("../v0/util");
const stats = require("../util/stats");
const match = require("match-json");
const jsonDiff = require("json-diff");
const logger = require("../logger");

class DestProxyController {
  /**
   * Handler for testing the destination proxy
   * @param {*} destination Destination name
   * @param {*} ctx 
   * @returns 
   */
  static handleProxyTestRequest = async (destination, ctx) => {
    const { deliveryPayload: routerDeliveryPayload, destinationRequestPayload: routerDestReqPayload } = ctx.request.body;
    let response;
    try {
      const destNetworkHandler = networkHandlerFactory.getNetworkHandler(
        destination
      );
      
      const proxyDestReqPayload = destNetworkHandler.prepareProxy(routerDeliveryPayload);
      response = {
        destinationRequestPayload: proxyDestReqPayload,
      };

      // Special handling required as Go and JavaScript encodes
      // URL parameters differently
      const { payloadFormat } = getPayloadData(routerDeliveryPayload.body);
      if (payloadFormat === "FORM") {
        // This is to make sure we encode `~` in the data coming from the router.
        // The data coming from the router is already a query parameter string
        const routerDataVal = new URLSearchParams(routerDestReqPayload.data);
        routerDestReqPayload.data = routerDataVal;
  
        const proxyDataVal = new URLSearchParams();
        proxyDestReqPayload.data.forEach(function(value, key) {
          const encodeAsterisk = (x) => x.replace(/\*/g, "%2A");
          // Router encodes `*` as well
          proxyDataVal.append(encodeAsterisk(key), encodeAsterisk(value));
        });
        proxyDestReqPayload.data = proxyDataVal;
      }

      // Compare the destination request payloads from router and proxy
      if (!match(routerDestReqPayload, proxyDestReqPayload)) {
        stats.counter("proxy_test_payload_mismatch", 1, {
          destination
        });

        logger.error(`[TransformerProxyTest] Destination request payload mismatch!`);
        logger.error(
          `[TransformerProxyTest] Delivery payload (router): ${JSON.stringify(routerDeliveryPayload)}`
        );
        logger.error(
          `[TransformerProxyTest] Destination request payload (router): ${JSON.stringify(routerDestReqPayload)}`
        );
        logger.error(
          `[TransformerProxyTest] Destination request payload (proxy): ${JSON.stringify(proxyDestReqPayload)} `
        );

        // Compute output difference
        const outputDiff = jsonDiff.diffString(
          routerDestReqPayload,
          proxyDestReqPayload
        );
        logger.error(`[TransformerProxyTest] Destination request payload difference: ${outputDiff}`);
        response = {
          outputDiff,
          ...response
        };
      } else {
        stats.counter("proxy_test_payload_match", 1, {
          destination
        });
      }
    } catch (err) {
      stats.counter("proxy_test_error", 1, {
        destination
      });
      
      response = generateErrorObject(
        err,
        destination,
        TRANSFORMER_METRIC.TRANSFORMER_STAGE.RESPONSE_TRANSFORM
      );
      response.message = `[TransformerProxyTest] Error occurred while testing proxy for destination ("${destination}"): "${err.message}"`;
      logger.error(response.message);
      logger.error(err);
      logger.error(
        `[TransformerProxyTest] Delivery payload (router): ${JSON.stringify(routerDeliveryPayload)}`
      );
      logger.error(
        `[TransformerProxyTest] Destination request payload (router): ${JSON.stringify(routerDestReqPayload)}`
      );
    }

    // Always return success as router doesn't care
    ctx.status = 200;
    ctx.body = { output: response };
    return ctx.body;
  };
}

module.exports = { DestProxyController };

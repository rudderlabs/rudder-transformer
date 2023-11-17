import match from 'match-json';
import jsonDiff from 'json-diff';
import networkHandlerFactory from '../../adapters/networkHandlerFactory';
import { getPayloadData } from '../../adapters/network';
import { generateErrorObject } from '../../v0/util';
import stats from '../../util/stats';
import logger from '../../logger';
import tags from '../../v0/util/tags';

export class DeliveryTestService {
  public static async doTestDelivery(
    destination: string,
    routerDestReqPayload: any,
    routerDeliveryPayload: any,
  ) {
    let response: any;
    try {
      const destNetworkHandler = networkHandlerFactory.getNetworkHandler(destination);

      const proxyDestReqPayload = destNetworkHandler.prepareProxy(routerDeliveryPayload);
      response = {
        destinationRequestPayload: proxyDestReqPayload,
      };

      // Special handling required as Go and JavaScript encodes
      // URL parameters differently
      const { payloadFormat } = getPayloadData(routerDeliveryPayload.body);
      if (payloadFormat === 'FORM') {
        // This is to make sure we encode `~` in the data coming from the router.
        // The data coming from the router is already a query parameter string
        const routerDataVal = new URLSearchParams(routerDestReqPayload.data);
        // eslint-disable-next-line no-param-reassign
        routerDestReqPayload.data = routerDataVal;

        const proxyDataVal = new URLSearchParams();
        proxyDestReqPayload.data.forEach((value, key) => {
          const encodeAsterisk = (x) => x.replace(/\*/g, '%2A');
          // Router encodes `*` as well
          proxyDataVal.append(encodeAsterisk(key), encodeAsterisk(value));
        });
        proxyDestReqPayload.data = proxyDataVal;
      }

      // Compare the destination request payloads from router and proxy
      if (!match(routerDestReqPayload, proxyDestReqPayload)) {
        stats.counter('proxy_test_payload_mismatch', 1, {
          destination,
        });

        logger.error(`[TransformerProxyTest] Destination request payload mismatch!`);
        logger.error(
          `[TransformerProxyTest] Delivery payload (router): ${JSON.stringify(
            routerDeliveryPayload,
          )}`,
        );
        logger.error(
          `[TransformerProxyTest] Destination request payload (router): ${JSON.stringify(
            routerDestReqPayload,
          )}`,
        );
        logger.error(
          `[TransformerProxyTest] Destination request payload (proxy): ${JSON.stringify(
            proxyDestReqPayload,
          )} `,
        );

        // Compute output difference
        const outputDiff = jsonDiff.diffString(routerDestReqPayload, proxyDestReqPayload);
        logger.error(
          `[TransformerProxyTest] Destination request payload difference: ${outputDiff}`,
        );
        response = {
          outputDiff,
          ...response,
        };
      } else {
        stats.counter('proxy_test_payload_match', 1, {
          destination,
        });
      }
    } catch (err: any) {
      stats.counter('proxy_test_error', 1, {
        destination,
      });

      response = generateErrorObject(err, {
        [tags.TAG_NAMES.DEST_TYPE]: destination.toUpperCase(),
        [tags.TAG_NAMES.MODULE]: tags.MODULES.DESTINATION,
        [tags.TAG_NAMES.FEATURE]: tags.FEATURES.DATA_DELIVERY,
      });
      response.message = `[TransformerProxyTest] Error occurred while testing proxy for destination ("${destination}"): "${err.message}"`;
      logger.error(response.message);
      logger.error(err);
      logger.error(
        `[TransformerProxyTest] Delivery payload (router): ${JSON.stringify(
          routerDeliveryPayload,
        )}`,
      );
      logger.error(
        `[TransformerProxyTest] Destination request payload (router): ${JSON.stringify(
          routerDestReqPayload,
        )}`,
      );
    }
    return response;
  }
}

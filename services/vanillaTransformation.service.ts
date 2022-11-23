import { processCdkV2Workflow } from "../cdk/v2/handler";
import { getCdkV2TestThreshold } from "../cdk/v2/utils";
import { DestHandlerMap } from "../constants/destinationCanonicalNames";
import logger from "../logger";
import { ProcessorRequest } from "../types/procRequestT";
import { CommonUtils } from "../util/common";
import stats from "../util/stats";
import { getErrorStatusCode } from "../v0/util";
import { TRANSFORMER_METRIC } from "../v0/util/constant";

export class VanillaDestinationService {
  private static destHandlerMap: Map<string, any> = new Map();

  private static getDestHandler(version: string, dest: string) {
    if (DestHandlerMap.hasOwnProperty(dest)) {
      return require(`../${version}/destinations/${DestHandlerMap[dest]}/transform`);
    }
    return require(`../${version}/destinations/${dest}/transform`);
  }

  private static async getCdkV2Result(
    destName: string,
    event: ProcessorRequest,
    flowType: string
  ) {
    const cdkResult: any = {};
    try {
      cdkResult.output = JSON.parse(
        JSON.stringify(await processCdkV2Workflow(destName, event, flowType))
      );
    } catch (error) {
      cdkResult.error = {
        message: error.message,
        statusCode: getErrorStatusCode(error)
      };
    }
    return cdkResult;
  }

  private static async compareWithCdkV2(
    destType: string,
    input: ProcessorRequest,
    flowType: string,
    v0Result: any
  ) {
    try {
      const envThreshold = parseFloat(process.env.CDK_LIVE_TEST || "0");
      let destThreshold = getCdkV2TestThreshold(input);
      if (flowType === TRANSFORMER_METRIC.ERROR_AT.RT) {
        destThreshold = getCdkV2TestThreshold(input[0]);
      }
      const liveTestThreshold = envThreshold * destThreshold;
      if (
        Number.isNaN(liveTestThreshold) ||
        !liveTestThreshold ||
        liveTestThreshold < Math.random()
      ) {
        return;
      }
      const cdkResult = await this.getCdkV2Result(destType, input, flowType);
      const objectDiff = CommonUtils.objectDiff(v0Result, cdkResult);
      if (Object.keys(objectDiff).length > 0) {
        stats.counter("cdk_live_compare_test_failed", 1, {
          destType,
          flowType
        });
        logger.error(
          `[LIVE_COMPARE_TEST] failed for destType=${destType}, flowType=${flowType}, diff=${JSON.stringify(
            objectDiff
          )}`
        );
        logger.error(
          `[LIVE_COMPARE_TEST] failed for destType=${destType}, flowType=${flowType}, v0Result=${JSON.stringify(
            v0Result
          )}, cdkResult=${JSON.stringify(cdkResult)}`
        );
        return;
      }
      stats.counter("cdk_live_compare_test_success", 1, { destType, flowType });
    } catch (error) {
      stats.counter("cdk_live_compare_test_errored", 1, { destType, flowType });
      logger.error(
        `[LIVE_COMPARE_TEST] errored for destType=${destType}, flowType=${flowType}`,
        error
      );
    }
  }
  private static async handleV0Destination(
    destHandler: Function,
    destType: string,
    input: ProcessorRequest,
    flowType: string
  ) {
    const result: any = {};
    try {
      result.output = await destHandler(input);
      return result.output;
    } catch (error) {
      result.error = {
        message: error.message,
        statusCode: getErrorStatusCode(error)
      };
      throw error;
    } finally {
      if (process.env.NODE_ENV === "test") {
        await this.compareWithCdkV2(destType, input, flowType, result);
      } else {
        this.compareWithCdkV2(destType, input, flowType, result);
      }
    }
  }

  public static async processVanillaDestination(
    destination: string,
    event: ProcessorRequest,
    flowType: string
  ) {
    let destHandler: any;
    if (this.destHandlerMap.get(destination)) {
      destHandler = this.destHandlerMap.get(destination);
    } else {
      destHandler = this.getDestHandler("v0", destination);
      this.destHandlerMap.set(destination, destHandler);
    }
    const respEvents = await this.handleV0Destination(
      destHandler.process,
      destination,
      event,
      flowType
    );
    return respEvents;
  }
}

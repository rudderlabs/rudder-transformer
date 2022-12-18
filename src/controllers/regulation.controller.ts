import { Context } from "koa";
import logger from "../logger";
import { getErrorStatusCode } from "../v0/util";
import { client as errNotificationClient } from "../util/errorNotifier";

// TODO: refactor this class to new format
export default class RegulationController {
  // TODO: USe stored state
  private static getDeletionUserHandler(version, dest) {
    return `../${version}/destinations/${dest}/deleteUsers`;
  }

  // TODO: Use new format
  private static getReqMetadata(ctx: Context) {
    try {
      const reqBody = ctx.request.body;
      return { destType: reqBody?.destType };
    } catch (error) {
      // Do nothing
    }
    return {};
  }

  // TODO: use new format
  private static getCommonMetadata(ctx) {
    // TODO: Parse information such as
    // cluster, namespace, etc information
    // from the request
    return {
      namespace: "Unknown",
      cluster: "Unknown"
    };
  }
  public static async handleUserDeletion(ctx: Context) {
    const getRudderDestInfo = () => {
      try {
        const rudderDestInfoHeader = ctx.get("x-rudder-dest-info");
        const destInfoHeader = JSON.parse(rudderDestInfoHeader);
        if (!Array.isArray(destInfoHeader)) {
          return destInfoHeader;
        }
      } catch (error) {
        logger.error(
          `Error while getting rudderDestInfo header value: ${error}`
        );
      }
      return {};
    };

    const { body } = ctx.request;
    const respList = [];
    const rudderDestInfo = getRudderDestInfo();
    let response;
    await Promise.all(
      body.map(async reqBody => {
        const { destType } = reqBody;
        const destUserDeletionHandler = this.getDeletionUserHandler(
          "v0",
          destType.toLowerCase()
        );
        if (
          !destUserDeletionHandler ||
          !destUserDeletionHandler.processDeleteUsers
        ) {
          ctx.status = 404;
          ctx.body = "Doesn't support deletion of users";
          return null;
        }

        try {
          response = await destUserDeletionHandler.processDeleteUsers({
            ...reqBody,
            rudderDestInfo
          });
          if (response) {
            respList.push(response);
          }
        } catch (error) {
          // adding the status to the request
          const errorStatus = getErrorStatusCode(error);
          ctx.status = errorStatus;
          const resp = {
            statusCode: errorStatus,
            error: error.message || "Error occurred while processing"
          };
          // Support for OAuth refresh
          if (error.authErrorCategory) {
            resp.authErrorCategory = error.authErrorCategory;
          }
          respList.push(resp);
          logger.error(
            `Error Response List: ${JSON.stringify(respList, null, 2)}`
          );
          errNotificationClient.notify(error, "User Deletion", {
            ...resp,
            ...this.getCommonMetadata(ctx),
            ...this.getReqMetadata(ctx)
          });
        }
      })
    );
    ctx.body = respList;
    return ctx.body;
  }
}

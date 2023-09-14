import { client } from '../util/errorNotifier';

export default class ErrorReportingService {
  public static reportError(error: NonNullable<unknown>, context: string, errorResp: object) {
    client.notify(error, context, {
      ...errorResp,
    });
  }
}

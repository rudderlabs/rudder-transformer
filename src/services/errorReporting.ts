import { client } from '../util/errorNotifier';

export class ErrorReportingService {
  public static reportError(error: NonNullable<unknown>, context: string, errorResp: object) {
    client.notify(error, context, {
      ...errorResp,
    });
  }
}

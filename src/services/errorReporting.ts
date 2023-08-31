import { client } from '../util/errorNotifier';

export class ErrorReportingService {
  public static reportError(error: Object, context: string, errorResp: Object) {
    client.notify(error, context, {
      ...errorResp,
    });
  }
}

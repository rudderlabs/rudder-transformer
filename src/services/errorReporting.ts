import { client } from '../util/errorNotifier';

export default class ErrorReportingService {
  public static reportError(error: Object, context: string, errorResp: Object) {
    client.notify(error, context, {
      ...errorResp,
    });
  }
}

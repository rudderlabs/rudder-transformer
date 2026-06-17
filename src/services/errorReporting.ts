import { client } from '../util/errorNotifier';

export class ErrorReportingService {
  public static reportError(error: NonNullable<unknown>, context: string, errorResp: object) {
    // Sensitive `metadata` (containing `secret`) is stripped centrally in client.notify
    client.notify(error, context, errorResp);
  }
}

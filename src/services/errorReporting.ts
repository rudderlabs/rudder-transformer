import { client } from '../util/errorNotifier';

export class ErrorReportingService {
  public static reportError(error: NonNullable<unknown>, context: string, errorResp: object) {
    const metadata = {
      ...errorResp,
      // metadata contains secret which should not be sent to error notifier
      metadata: undefined,
    };
    client.notify(error, context, metadata);
  }
}

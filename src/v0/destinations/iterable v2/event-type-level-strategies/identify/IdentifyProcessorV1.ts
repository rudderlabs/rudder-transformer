/* eslint-disable no-console */
import { BaseProcessor } from '../baseProcessor';

export class IdentifyProcessor extends BaseProcessor {
  getMessageBody(message: any): any {
    // Implement logic to return the message body
    return { data: message };
  }
}

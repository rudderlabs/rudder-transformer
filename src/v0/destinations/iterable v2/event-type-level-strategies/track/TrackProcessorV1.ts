import { BaseProcessor } from '../baseProcessor';

export class TrackProcessor extends BaseProcessor {
  getMessageBody(message: any): object {
    // Implement logic to return the message body
    return { data: message };
  }
}

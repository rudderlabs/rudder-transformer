import { InputTypeStrategy } from '../type';

export class EventTypeProcessorContext {
  constructor(private strategy: InputTypeStrategy) {}

  getMessageBody(data: any): any {
    return { ...data, version: 'v1' };
  }
}

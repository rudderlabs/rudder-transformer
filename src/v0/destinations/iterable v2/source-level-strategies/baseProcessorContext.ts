import { InputClassificationStrategy } from '../type';

export class InputProcessorContext {
  constructor(private strategy: InputClassificationStrategy) {}

  execute(data: any): any {
    return this.strategy.processInput(data);
  }
}

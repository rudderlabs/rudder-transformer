import { ComplexityLevel, ContextData, GenericContextGenerator } from '../../../common/generators';

export class ContextGenerator extends GenericContextGenerator {
  // Inherits all functionality from GenericContextGenerator
  // Can override specific methods if rudder_test needs custom behavior

  generateContext(complexity: ComplexityLevel): ContextData {
    return super.generateContext(complexity);
  }
}

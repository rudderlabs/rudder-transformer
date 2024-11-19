import { VersionConversionStrategy } from './conversionStrategies/abstractions';
import { StrategyDefault } from './conversionStrategies/strategyDefault';
import { StrategyV0ToV1 } from './conversionStrategies/strategyV0ToV1';
import { StrategyV1ToV0 } from './conversionStrategies/strategyV1ToV0';
import { StrategyV1ToV2 } from './conversionStrategies/strategyV1ToV2';
import { StrategyV2ToV0 } from './conversionStrategies/strategyV2ToV0';
import { StrategyV2ToV1 } from './conversionStrategies/strategyV2ToV1';

export class VersionConversionFactory {
  private strategyCache: Map<string, VersionConversionStrategy<any, any>> = new Map();

  private getCase(requestVersion: string, implementationVersion: string) {
    return `${String(requestVersion)}-to-${String(implementationVersion)}`;
  }

  public getStrategy(
    requestVersion: string,
    implementationVersion: string,
  ): VersionConversionStrategy<any, any> {
    const versionCase = this.getCase(requestVersion, implementationVersion);

    if (this.strategyCache.has(versionCase)) {
      const cachedStrategy = this.strategyCache.get(versionCase);
      if (cachedStrategy) {
        return cachedStrategy;
      }
    }

    let strategy: VersionConversionStrategy<any, any>;

    switch (versionCase) {
      case 'v0-to-v1':
        strategy = new StrategyV0ToV1();
        break;

      case 'v1-to-v0':
        strategy = new StrategyV1ToV0();
        break;

      case 'v1-to-v2':
        strategy = new StrategyV1ToV2();
        break;

      case 'v2-to-v0':
        strategy = new StrategyV2ToV0();
        break;

      case 'v2-to-v1':
        strategy = new StrategyV2ToV1();
        break;

      default:
        strategy = new StrategyDefault();
        break;
    }

    if (strategy) {
      this.strategyCache[versionCase] = strategy;
    }

    return strategy;
  }
}

export const versionConversionFactory = new VersionConversionFactory();

import Executor from '../interfaces/Executor';
import { TransformationError } from '../v0/util/errorTypes';
import SalesforceExecutor from '../v1/destinations/salesforce/executor';

export default class FetchAdaptiveHandlers {
  // add static variable to store the implementation name
  private static cachedImplementation: Map<string, Executor> = new Map<string, Executor>();

  public static getAdapterExecutor(destinationType: string): Executor {
    switch (destinationType) {
      case 'salesforce': {
        // check if the implementation is already cached
        if (FetchAdaptiveHandlers.cachedImplementation.has(destinationType)) {
          FetchAdaptiveHandlers.cachedImplementation.get(destinationType);
        }
        // if not cached, create a new instance and cache it
        const implementation = new SalesforceExecutor();
        FetchAdaptiveHandlers.cachedImplementation.set(destinationType, implementation);
        return implementation;
      }
      // continue expanding this switch case based on destintion type onboarding
      default:
        throw new TransformationError('Invalid destination type');
    }
  }
}

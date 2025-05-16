import { UserTransformService } from '../userTransform';
import { ProcessorTransformationRequest, UserTransformationServiceResponse } from '../../types';
import { FeatureFlags } from '../../middlewares/featureFlag';

// Worker function that will run in the worker thread
export default async function transform({
  events,
  features,
  requestSize,
}: {
  events: ProcessorTransformationRequest[];
  features: FeatureFlags;
  requestSize: number;
}): Promise<UserTransformationServiceResponse> {
  return UserTransformService.transformRoutine(events, features, requestSize);
}

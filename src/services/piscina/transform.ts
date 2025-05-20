import { UserTransformService } from '../userTransform';
import { ProcessorTransformationRequest, UserTransformationServiceResponse } from '../../types';
import { FeatureFlags } from '../../middlewares/featureFlag';

// Worker function that will run in the worker thread
export default async function transform({
  events,
  features,
  requestSize,
  body,
}: {
  events?: ProcessorTransformationRequest[];
  features: FeatureFlags;
  requestSize: number;
  body?: string;
}): Promise<UserTransformationServiceResponse> {
  // If body is provided, parse it in the worker thread
  if (body) {
    const parsedEvents = JSON.parse(body) as ProcessorTransformationRequest[];
    return UserTransformService.transformRoutine(parsedEvents, features, requestSize);
  }
  // Fallback to the original implementation
  return UserTransformService.transformRoutine(events!, features, requestSize);
}

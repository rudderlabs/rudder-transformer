import Piscina from 'piscina';
import path from 'path';
import { ProcessorTransformationRequest, UserTransformationServiceResponse } from '../../types';
import { FeatureFlags } from '../../middlewares/featureFlag';

// Determine if we're in development/test environment
const isTest = process.env.NODE_ENV === 'test';

// Create Piscina instance
let piscina: Piscina | null = null;

export function getPiscinaInstance() {
  if (!piscina) {
    piscina = new Piscina({
      filename: path.resolve(__dirname, `transform${isTest ? '.ts' : '.js'}`),
      execArgv: isTest ? ['-r', 'ts-node/register'] : undefined,
    });
  }
  return piscina;
}

export async function terminatePiscina() {
  if (piscina) {
    await piscina.destroy();
    piscina = null;
  }
}

// Main function to run transformation with Piscina
export async function transformWithPiscina(
  events: ProcessorTransformationRequest[],
  features: FeatureFlags,
  requestSize: number,
): Promise<UserTransformationServiceResponse> {
  return getPiscinaInstance().run({ events, features, requestSize });
}

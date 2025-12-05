import { z } from 'zod';
import { Destination, RouterTransformationRequestData, RudderMessage } from '../../../types';

/**
 * VWO Destination Configuration Schema
 * 
 * This schema defines and validates the configuration required for VWO integration.
 */
export const VWODestinationConfigSchema = z
  .object({
    accountId: z.string().min(1, 'Account ID is required'),
    region: z.enum(['DEFAULT', 'EU', 'AS']).optional().default('DEFAULT'),
  })
  .passthrough();

/**
 * VWO Event Payload Structure
 * 
 * This defines the structure of data sent to VWO's offline conversion API
 */
export interface VWOEventPayload {
  d: {
    msgId: string;
    visId: string;
    event: {
      props: {
        isCustomEvent: boolean;
        vwoMeta: {
          source: string;
        };
        [key: string]: any;
      };
      name: string;
      time: number;
    };
    sessionId: number;
  };
}

/**
 * Type definitions inferred from Zod schemas
 */
export type VWODestinationConfig = z.infer<typeof VWODestinationConfigSchema>;
export type VWODestination = Destination<VWODestinationConfig>;
export type VWORouterRequest = RouterTransformationRequestData<RudderMessage, VWODestination>;


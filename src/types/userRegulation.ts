import type { FixMe } from './index';

/**
 * Types for user data regulation operations
 */
export type UserDeletionRequest = {
  userAttributes: FixMe[];
  config: object;
  destType: string;
  jobId: string;
};

export type UserDeletionResponse = {
  statusCode: number;
  error?: string;
  status?: string;
  authErrorCategory: FixMe;
  statTags: object;
};

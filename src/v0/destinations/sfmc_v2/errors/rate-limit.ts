import { RateLimitInfo } from '../types';

export class SFMCRateLimitError extends Error {
  rateLimitInfo: RateLimitInfo;

  constructor(message: string, rateLimitInfo: RateLimitInfo) {
    super(message);
    this.name = 'SFMCRateLimitError';
    this.rateLimitInfo = rateLimitInfo;
  }
}

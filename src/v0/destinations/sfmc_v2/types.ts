// Rate limit interface
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
}

// Token cache interface
export interface TokenCache {
  token: string;
  expiresAt: number;
}

// Error response interface
export interface SFMCErrorResponse {
  message: string;
  errorcode?: number;
  documentation?: string;
}

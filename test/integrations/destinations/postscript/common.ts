import { generateMetadata } from '../../testUtils';
import { Destination } from '../../../../src/types';
import { envMock } from './mocks';

// Constants
export const destType = 'postscript';
export const destTypeInUpperCase = 'POSTSCRIPT';
export const channel = 'server';
export const displayName = 'Postscript';
envMock();

// Destination configuration with proper typing
export const destination: Destination = {
  Config: {
    apiKey: 'ps_test_api_key',
  },
  DestinationDefinition: {
    DisplayName: displayName,
    ID: 'ps-123',
    Name: destTypeInUpperCase,
    Config: { cdkV2Enabled: false },
  },
  Enabled: true,
  ID: 'ps-123',
  Name: destTypeInUpperCase,
  Transformations: [],
  WorkspaceID: 'test-workspace-id',
};

// Header interfaces
interface PostscriptAuthHeaders {
  Accept: string;
  Authorization: string;
  'X-Postscript-Partner-Key': string | undefined;
}

interface PostscriptRequestHeaders extends PostscriptAuthHeaders {
  [key: string]: string | undefined;
  'Content-type': string;
  Authorization: string;
}

// Headers with proper typing
export const getHeader: PostscriptAuthHeaders = {
  Accept: 'application/json',
  Authorization: 'Bearer ps_test_api_key',
  'X-Postscript-Partner-Key': process.env.POSTSCRIPT_PARTNER_API_KEY,
};

export const postPatchHeader: PostscriptRequestHeaders = {
  ...getHeader,
  'Content-type': 'application/json',
};

// Test user data interfaces
interface TestUser {
  userId: string;
  email: string;
  phone: string;
  keyword: string;
  tags: string[];
}

interface ExistingTestUser extends TestUser {
  subscriberId: string;
}

interface TestUsers {
  newUser: TestUser;
  existingUser: ExistingTestUser;
}

// Common test user data with proper typing
export const testUsers: TestUsers = {
  newUser: {
    userId: 'user-1',
    email: 'newuser@example.com',
    phone: '+1111111111',
    keyword: 'WELCOME',
    tags: ['tag1'],
  },
  existingUser: {
    userId: 'user-2',
    email: 'existinguser@example.com',
    phone: '+1234567890',
    keyword: 'OFFER',
    tags: ['tag2'],
    subscriberId: 'sub_12345',
  },
};

// Endpoints interface and configuration
interface PostscriptEndpoints {
  subscribers: string;
  customEvents: string;
  subscriberById: (id: string) => string;
  subscriberLookup: (emails: string[]) => string;
}

// Common endpoints with proper typing
export const endpoints: PostscriptEndpoints = {
  subscribers: 'https://api.postscript.io/api/v2/subscribers',
  customEvents: 'https://api.postscript.io/api/v2/custom-events',
  subscriberById: (id: string) => `https://api.postscript.io/api/v2/subscribers/${id}`,
  subscriberLookup: (emails: string[]) =>
    `https://api.postscript.io/api/v2/subscribers?email__in=${emails.map((e) => encodeURIComponent(e)).join(',')}`,
};

// Helper function to generate consistent metadata with proper typing
export const generateTestMetadata = (jobId: number) => generateMetadata(jobId);

// Common traits interface for test messages
export interface TestTraits {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  tags?: string[];
  keyword?: string;
}

// Common properties interface for track events
export interface TestProperties {
  event_name?: string;
  properties?: Record<string, any>;
  [key: string]: any;
}

// Additional utility types for Postscript API
export interface PostscriptSubscriber {
  id?: string;
  email?: string;
  phone_number?: string;
  first_name?: string;
  last_name?: string;
  tags?: string[];
  keyword?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PostscriptCustomEvent {
  event_name: string;
  email?: string;
  phone_number?: string;
  properties?: Record<string, any>;
  occurred_at?: string;
}

// Common test constants
export const commonConstants = {
  testTimestamp: '2025-06-23T10:00:00.000Z',
  testWorkspaceId: 'test-workspace-id',
  testUserAgent: 'Mozilla/5.0 (compatible; RudderStack Test)',
  testIP: '192.168.1.1',
  defaultTags: ['test', 'automation'],
} as const;

// Status codes for API responses
export const statusCodes = {
  success: 200,
  created: 201,
  badRequest: 400,
  unauthorized: 401,
  notFound: 404,
  validationError: 400,
} as const;

// Common error messages for testing
export const errorMessages = {
  missingEmail: 'Email is required for subscriber operations',
  invalidEventType: 'Event type not supported',
  missingRequiredFields: 'Missing required fields',
  invalidCredentials: 'Invalid API credentials',
};

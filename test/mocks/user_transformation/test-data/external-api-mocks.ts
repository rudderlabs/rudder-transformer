// Mock external API responses for fetch calls made by user transformations
export const externalApiMocks: Record<string, any> = {
  'https://api.example.com/enrich': {
    method: 'POST',
    response: {
      status: 200,
      headers: { 'content-type': 'application/json' },
      body: {
        enriched: true,
        timestamp: '2023-01-01T00:00:00Z',
        source: 'external-api',
      },
    },
  },

  'https://api.example.com/user-profile': {
    method: 'GET',
    response: {
      status: 200,
      headers: { 'content-type': 'application/json' },
      body: {
        profile: {
          segment: 'premium',
          preferences: ['email', 'sms'],
          lastSeen: '2023-01-01T00:00:00Z',
        },
      },
    },
  },

  'https://api.example.com/error': {
    method: 'GET',
    response: {
      status: 500,
      headers: { 'content-type': 'application/json' },
      body: { error: 'Internal server error' },
    },
  },
};

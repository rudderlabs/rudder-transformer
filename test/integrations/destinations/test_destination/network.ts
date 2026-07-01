// ⚠️ DEV-ONLY TEST FIXTURE — NOT A REAL DESTINATION (INT-6492).
// Mocked delivery responses for the `.invalid` (non-resolving) test endpoint.
export const networkCallsData = [
  {
    description: 'test_destination v1 delivery — destination accepts the echoed event',
    httpReq: {
      method: 'POST',
      url: 'https://eu.test-destination.invalid/v1/events',
      headers: { 'Content-Type': 'application/json', 'X-Api-Key': 'v1-secret-key' },
      data: { event: 'Test Event', userId: 'user-1' },
    },
    httpRes: { data: { success: true }, status: 200 },
  },
];

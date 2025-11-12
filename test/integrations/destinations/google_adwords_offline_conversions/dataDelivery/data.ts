/**
 * GAOC (Google Ads Offline Conversions) - Data Delivery Tests (Standard Behavior)
 *
 * These tests validate the data delivery (proxy v0/v1) with batch fetching DISABLED (default).
 * For tests with batch fetching enabled (GAOC_ENABLE_BATCH_FETCHING=true),
 * see batchFetching/data.ts.
 */

import { v0oauthScenarios, v1oauthScenarios } from './oauth';
import { testScenariosForV0API, testScenariosForV1API } from './business';

export const data = [
  ...v0oauthScenarios,
  ...v1oauthScenarios,
  ...testScenariosForV0API,
  ...testScenariosForV1API,
];

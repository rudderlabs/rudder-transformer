/**
 * GAOC (Google Ads Offline Conversions) - Data Delivery Tests with Batch Fetching Feature Flag
 *
 * IMPORTANT: These tests are duplicates of the existing dataDelivery test suite with a critical difference:
 * All tests in this file include `envOverrides: { GAOC_ENABLE_BATCH_FETCHING: 'true' }` to test the new
 * batch fetching optimization feature for Google Ads Offline Conversions.
 *
 * Background:
 * - GAOC now supports env-based feature flag: GAOC_ENABLE_BATCH_FETCHING
 * - When enabled, conversion variable fetching is optimized with batch requests
 * - These tests validate data delivery (proxy) behavior with the feature flag ENABLED
 * - The original tests (dataDelivery/data.ts) validate behavior with the feature flag DISABLED (default)
 *
 * Test Coverage:
 * - OAuth scenarios (v0 and v1 API): Authentication and authorization flows
 * - Business scenarios (v0 and v1 API): Actual data delivery to Google Ads API
 *
 * Relationship to original tests:
 * - Test cases are based on test/integrations/destinations/google_adwords_offline_conversions/dataDelivery/*
 * - Test scenarios and expected behaviors are identical except for the feature flag setting
 * - This allows parallel testing of both old (flag off) and new (flag on) behavior
 *
 * For PR reviewers: This is an intentional duplication to ensure backward compatibility while
 * testing the new batch fetching feature. Once the feature is proven stable, we can remove old code and test.
 */

import { v1oauthScenarios } from './oauth';
import { testScenariosForV1API } from './business';

export const data = [...v1oauthScenarios, ...testScenariosForV1API];

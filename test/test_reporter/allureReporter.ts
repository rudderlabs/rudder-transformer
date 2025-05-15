import * as allure from 'allure-js-commons';
import { diff as jsonDiff } from 'jest-diff';
import _ from 'lodash';
import { TestCaseData } from '../integrations/testTypes';
import { compareObjects } from '../integrations/testUtils';

interface TestReportData {
  testCase: TestCaseData;
  actualResponse: any;
  status: 'passed' | 'failed';
  verbose: boolean;
  diff?: string;
}

/**
 * Enhanced test reporter with detailed JSON diff and Allure integration
 */
export const enhancedTestReport = {
  /**
   * Generate a detailed test report with JSON diff for failed cases
   */
  generateDetailedReport(data: TestReportData) {
    const { testCase, actualResponse, status, verbose } = data;
    const expectedResponse = testCase.output.response?.body;

    // Create Allure test case details
    allure.description(`
      Feature: ${testCase.feature}
      Description: ${testCase.description}
      Success Criteria: ${testCase.successCriteria || 'N/A'}
      Scenario: ${testCase.scenario || 'N/A'}
      Test ID: ${testCase.id || 'N/A'}
      API Version: ${testCase.version || 'N/A'}
    `);

    // Add request/response as attachments
    allure.attachment(
      'Request',
      JSON.stringify(testCase.input.request, null, 2),
      'application/json',
    );
    allure.attachment(
      'Actual Response',
      JSON.stringify(actualResponse, null, 2),
      'application/json',
    );

    if (status === 'failed') {
      const diffResult = jsonDiff(expectedResponse, actualResponse, {
        expand: false, // Compact diff view
        contextLines: 3, // Show 3 lines of context around changes
      });

      const diffKeys = compareObjects(expectedResponse, actualResponse);

      if (diffResult) {
        allure.attachment(
          'Expected Response',
          JSON.stringify(expectedResponse, null, 2),
          'application/json',
        );

        allure.attachment('Diff Keys', JSON.stringify(diffKeys), 'text/plain');
      }

      // Add failure details
      const failureMessage = `Test failed for ${testCase.name}\nSee JSON diff for details`;
      allure.step(failureMessage, () => {
        console.log(failureMessage);
        if (verbose) {
          expect(actualResponse).toEqual(expectedResponse);
        }
      });
    }

    return status;
  },

  /**
   * Validate test case response with enhanced reporting
   */
  validateTestResponse(testCase: TestCaseData, response: any, verbose: boolean = false): boolean {
    const expectedResponse = testCase.output.response?.body;
    const actualResponse = response;
    const status = _.isEqual(actualResponse, expectedResponse) ? 'passed' : 'failed';

    this.generateDetailedReport({
      testCase,
      actualResponse,
      status,
      verbose,
    });

    return status === 'passed';
  },
};

/**
 * Enhanced test utilities with better organization
 */
export const enhancedTestUtils = {
  /**
   * Setup test suite with Allure reporting
   */
  setupTestSuite(testData: TestCaseData) {
    allure.epic(testData.name);
    allure.feature(testData.module);
    allure.story(testData.feature);
    allure.displayName(testData.description);
    if (testData.scenario) {
      allure.tag(testData.scenario);
    }
    if (testData.tags) {
      allure.tags(...testData.tags);
    }
    if (testData.id) {
      allure.allureId(testData.id);
    }
  },

  /**
   * Run pre-test preparations
   */
  beforeTestRun(testCase: TestCaseData) {
    allure.step('Test Setup', () => {
      // Setup new test
      this.setupTestSuite(testCase);
    });
  },

  /**
   * Run post-test cleanup and reporting
   */
  afterTestRun(testCase: TestCaseData, response: any, verbose: boolean = false) {
    allure.step('Test Verification', () => {
      return enhancedTestReport.validateTestResponse(testCase, response, verbose);
    });
  },
};

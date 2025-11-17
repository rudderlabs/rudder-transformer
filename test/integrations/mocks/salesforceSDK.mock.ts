/**
 * Salesforce SDK Mock for Component Tests
 *
 * This file contains all Salesforce-specific mocks used in component tests.
 * The mocks handle SOQL queries for Leads and custom objects.
 */

/**
 * Creates a mock query function that handles different SOQL query patterns
 * @returns An async function that processes SOQL queries and returns mock results
 */
export const createMockQuery = () => {
  // Use a regular async function instead of jest.fn() to avoid reset issues
  return async (soqlQuery: string) => {
    // Handle different SOQL query patterns
    // Query for Lead by Email (backward compatibility)
    // The email is URL encoded (encodeURIComponent), so @ becomes %40
    // Check for peter.gibbons email in Lead queries - handle both encoded and unencoded
    if (soqlQuery.includes('FROM Lead') && soqlQuery.includes('WHERE Email')) {
      // Check for peter.gibbons@initech.com (may be URL encoded)
      const hasPeterGibbons = soqlQuery.includes('peter') && soqlQuery.includes('gibbons');
      const hasInitech = soqlQuery.includes('initech');
      if (hasPeterGibbons && hasInitech) {
        return {
          totalSize: 0,
          done: true,
          records: [],
        };
      }
      // Handle email with special characters - check for the email pattern
      if (soqlQuery.includes('ddv_ua') && soqlQuery.includes('bugFix')) {
        return {
          totalSize: 1,
          done: true,
          records: [
            {
              attributes: {
                type: 'Lead',
                url: '/services/data/v50.0/sobjects/Lead/leadId',
              },
              Id: 'leadId',
              IsConverted: false,
              ConvertedContactId: null,
              IsDeleted: false,
            },
          ],
        };
      }
    }
    // Query for custom object by CustomObject__c
    if (
      soqlQuery.includes('FROM customobject') &&
      soqlQuery.includes("CustomObject__c = '72727'")
    ) {
      return {
        totalSize: 0,
        done: true,
        records: [],
      };
    }
    // Query for customobject2 by CustomObject2__c = 72728
    if (
      soqlQuery.includes('FROM customobject2') &&
      soqlQuery.includes("CustomObject2__c = '72728'")
    ) {
      return {
        totalSize: 1,
        done: true,
        records: [
          {
            attributes: {
              type: 'CustomObject2__c',
              url: '/services/data/v50.0/sobjects/CustomObject2__c/id1101',
            },
            Id: 'id1101',
          },
        ],
      };
    }
    // Query for customobject2 by CustomObject2__c = 72729
    if (
      soqlQuery.includes('FROM customobject2') &&
      soqlQuery.includes("CustomObject2__c = '72729'")
    ) {
      return {
        totalSize: 1,
        done: true,
        records: [
          {
            attributes: {
              type: 'CustomObject2__c',
              url: '/services/data/v50.0/sobjects/CustomObject2__c/id1102',
            },
            Id: 'id1102',
          },
        ],
      };
    }
    // Default: return empty result for any other query
    return {
      totalSize: 0,
      done: true,
      records: [],
    };
  };
};

/**
 * Restores the SalesforceSDK mock implementation after Jest resets
 * This should be called in afterEach hooks to restore the mock after jest.resetAllMocks()
 */
export const restoreSalesforceSDKMock = () => {
  const mockedLib = jest.requireMock('@rudderstack/integrations-lib');
  if (mockedLib.SalesforceSDK?.Salesforce) {
    // Reapply the mock implementation if it was reset
    mockedLib.SalesforceSDK.Salesforce.mockImplementation(({ accessToken, instanceUrl }) => {
      return { query: createMockQuery() };
    });
  }
};

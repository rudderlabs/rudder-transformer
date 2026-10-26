export const SUPPORTED_HTTP_METHODS = ['POST', 'PUT', 'PATCH', 'GET', 'DELETE'] as const;

export const ACCOUNT_DEFINITION_NAMES = {
  BASIC_AUTH: 'DESTINATION_CUSTOM_AUDIENCE_BASIC_AUTH',
  BEARER_TOKEN: 'DESTINATION_CUSTOM_AUDIENCE_BEARER_TOKEN',
  API_KEY: 'DESTINATION_CUSTOM_AUDIENCE_API_KEY',
  OAUTH_CLIENT_CREDENTIALS: 'DESTINATION_CUSTOM_AUDIENCE_OAUTH_CLIENT_CREDENTIALS',
  OAUTH_AUTH_CODE: 'DESTINATION_CUSTOM_AUDIENCE_OAUTH_AUTH_CODE',
} as const;

export const ERROR_MESSAGES = {
  NO_ACTION_CONFIG: (action: string) => `No action configuration found for action: ${action}`,
  ALL_FIELDS_STRIPPED: 'All fields were stripped after processing; nothing to send',
  MISSING_REQUIRED_FIELDS: (action: string, missingFields: string[]) =>
    `Missing required fields for action "${action}": ${missingFields.join(', ')}`,
  TEMPLATE_EVALUATION_FAILED: (reason: string) =>
    `Failed to evaluate requestBody template: ${reason}`,
  // Reached when an endpoint template references a connection field the
  // connection does not set. Since audienceId is optional on the connection
  // schema, this is the backstop that tells the user which field to add —
  // naming the remedy, not just the unresolved placeholder.
  ENDPOINT_RESOLUTION_FAILED: (path: string) =>
    `Endpoint template references {{${path}}}, but the connection does not set it. ` +
    `Add the field to the connection, or remove the placeholder from the endpoint template.`,
  MISSING_ACCOUNT_ID:
    'Authentication is enabled, but rudderAccountId does not identify a linked delivery account',
  MISSING_DELIVERY_ACCOUNT:
    'A linked delivery account is selected, but deliveryAccount is missing or malformed',
  MISSING_ACCOUNT_DEFINITION: 'The linked delivery account is missing accountDefinitionName',
  UNKNOWN_ACCOUNT_DEFINITION: (name: string) =>
    `The linked delivery account uses unknown accountDefinitionName: ${name}`,
  INCOMPLETE_ACCOUNT: (name: string, fields: string[]) =>
    `The linked delivery account ${name} is incomplete; missing: ${fields.join(', ')}`,
};

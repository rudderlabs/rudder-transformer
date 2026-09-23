export const SUPPORTED_HTTP_METHODS = ['POST', 'PUT', 'PATCH', 'GET', 'DELETE'] as const;

export const AUTHENTICATION_TYPES = {
  NO_AUTH: 'noAuth',
  BASIC_AUTH: 'basicAuth',
  BEARER_TOKEN: 'bearerToken',
  API_KEY: 'apiKey',
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
};

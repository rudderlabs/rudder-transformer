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
  TEMPLATE_EVALUATION_FAILED: (reason: string) =>
    `Failed to evaluate requestBody template: ${reason}`,
  ENDPOINT_RESOLUTION_FAILED: (placeholder: string) =>
    `Unresolved placeholder in endpoint template: ${placeholder}`,
  CUSTOM_MAPPING_UNKNOWN_FIELD: (fieldName: string, allowedFields: string[]) =>
    `Custom mapping target "${fieldName}" is not a configured field. Allowed fields: ${allowedFields.join(', ')}`,
};

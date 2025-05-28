import { SFMCDestinationConfigSchema, SFMCConnectionConfigSchema } from './type';

export const destinationConfig = {
  name: 'SFMC',
  displayName: 'Salesforce Marketing Cloud',
  configSchema: SFMCDestinationConfigSchema,
  connectionConfigSchema: SFMCConnectionConfigSchema,
};

export const MAX_ITEMS = 150;

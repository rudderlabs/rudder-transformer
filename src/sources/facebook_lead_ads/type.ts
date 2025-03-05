export type InputEventType = Record<string, string[]>;

export type OutputEventType = {
  userId?: string;
  anonymousId?: string;
  type: 'identify';
  context: {
    traits: Record<string, string>;
    library: {
      name: string;
      version: string;
    };
    integration: {
      name: string;
    };
  };
  originalTimestamp?: Date;
};

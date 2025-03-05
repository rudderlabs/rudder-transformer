export type InputEventType = {
  [key: string]: string[];
};

export type OutputEventType = {
  userId?: string;
  anonymousId: string;
  type: 'identify';
  context: {
    traits: {
      [key: string]: string;
    };
  };
  originalTimestamp?: Date;
  [key: string]: any;
};

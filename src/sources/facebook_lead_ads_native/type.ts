type FacebookChangeValue = {
  created_time?: number;
  leadgen_id?: string;
  page_id?: string;
  form_id?: string;
};

export type FacebookChange = {
  value?: FacebookChangeValue;
};

export type FacebookEntry = {
  id?: string;
  time?: number;
  changes?: FacebookChange[];
};

export type InputEventType = {
  object?: string;
  entry?: FacebookEntry[];
};

export type OutputEventType = {
  anonymousId: string;
  messageId: string;
  type: string;
  context: {
    traits: {
      pageId: string;
      formId: string;
    };
  };
  originalTimestamp?: string;
  sentAt?: string;
};

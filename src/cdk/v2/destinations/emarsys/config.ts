interface GroupedPayload {
  method: 'PUT' | 'POST';
  batches: any[];
}

interface GroupedSuccessfulPayload {
  identify: GroupedPayload;
  group: GroupedPayload;
  track: GroupedPayload;
}

export const ALLOWED_OPT_IN_VALUES: string[] = ['1', '2', ''];
export const groupedSuccessfulPayload: GroupedSuccessfulPayload = {
  identify: {
    method: 'PUT',
    batches: [],
  },
  group: {
    method: 'POST',
    batches: [],
  },
  track: {
    method: 'POST',
    batches: [],
  },
};

export const MAX_BATCH_SIZE = 1000;
export const EMAIL_FIELD_ID = 3;
export const OPT_IN_FILED_ID = 31;
export const MAX_BATCH_SIZE_BYTES = 8000000; // 8 MB

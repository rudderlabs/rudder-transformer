interface FailedUpdates {
  invalidEmails?: string[];
  invalidUserIds?: string[];
  notFoundEmails?: string[];
  notFoundUserIds?: string[];
  invalidDataEmails?: string[];
  invalidDataUserIds?: string[];
  conflictEmails?: string[];
  conflictUserIds?: string[];
  forgottenEmails?: string[];
  forgottenUserIds?: string[];
}

export interface CommonResponse {
  msg?: string; // Optional since it's only in Response 1
  code?: string; // Optional since it's only in Response 1
  params?: Record<string, unknown>; // Optional, specific to Response 1
  successCount?: number; // Shared by Response 2 and 3
  failCount?: number; // Shared by Response 2 and 3
  invalidEmails?: string[]; // Shared by Response 2 and 3
  invalidUserIds?: string[]; // Shared by Response 2 and 3
  filteredOutFields?: string[]; // Shared by Response 2 and 3
  createdFields?: string[]; // Shared by Response 2 and 3
  disallowedEventNames?: string[]; // Specific to Response 3
  failedUpdates?: FailedUpdates; // Nested object for failed updates
}

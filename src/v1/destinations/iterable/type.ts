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
  msg?: string;
  code?: string;
  params?: Record<string, unknown>;
  successCount?: number;
  failCount?: number;
  invalidEmails?: string[];
  invalidUserIds?: string[];
  filteredOutFields?: string[];
  createdFields?: string[];
  disallowedEventNames?: string[];
  failedUpdates?: FailedUpdates;
}

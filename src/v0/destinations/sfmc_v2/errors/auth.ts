export class SFMCAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SFMCAuthError';
  }
}

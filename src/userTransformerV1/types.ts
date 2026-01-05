export interface CredentialInput {
  key: string;
  value: string;
  isSecret: boolean;
}

export type LibraryCodeInput = {
  importName: string;
  code: string;
};

export type LibraryVersionInput = {
  versionId: string;
};

export type LibraryInput = LibraryCodeInput | LibraryVersionInput;

export interface Dependencies {
  libraries: LibraryInput[];
  credentials: CredentialInput[];
}

export interface TransformationCodeRunnerInput {
  code: string;
  language: string;
  codeVersion?: '0' | '1';
  dependencies: Dependencies;
}

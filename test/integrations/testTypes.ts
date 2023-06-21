export interface requestType {
  method: string;
  body?: any;
  headers?: Record<string, string>;
  params?: Record<string, string>;
}

export interface responseType {
  status: number;
  body?: any;
  headers?: Record<string, string>;
}

export interface inputType {
  request: requestType;
  pathSuffix?: string;
}

export interface outputType {
  response?: responseType;
}

export interface mockType {
  request: requestType;
  response: responseType;
}

export interface TestCaseData {
  name: string;
  description: string;
  feature: string;
  module: string;
  version?: string;
  input: inputType;
  output: outputType;
  mock?: mockType[];
}

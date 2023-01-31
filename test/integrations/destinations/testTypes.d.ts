interface inputType {
  request: {
    method: string,
    body?: any,
    headers?: Record<string,string>,
    params?: Record<string,string>,
  },
  pathSuffix?: string
}

interface outputType {
  response?: {
    status: number,
    body?: any,
    headers?: Record<string,string>
  }
}

interface mockType {
  request: {
    method: string,
    body?: any,
    headers?: Record<string,string>,
    params?: Record<string,string>,
  },
  response: {
    status: number,
    body?: any,
    headers?: Record<string,string>
  }
}

interface testCaseDataType {
  name: string,
  description: string,
  feature: string,
  module: string,
  version?: string
  input: inputType,
  output: outputType,
  mock?: mockType[]
};



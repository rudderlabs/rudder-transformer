interface requestType {
  method: string,
  body?: any,
  headers?: Record<string,string>,
  params?: Record<string,string>
}

interface responseType {
  status: number,
  body?: any,
  headers?: Record<string,string>
}

interface inputType {
  request: requestType,
  pathSuffix?: string
}

interface outputType {
  response?: responseType
}

interface mockType {
  request: requestType,
  response: responseType
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



// Track replacements
let replacements: Map<
  string,
  {
    type: string;
    value: string;
    secrets: string[];
    variableNames: string[];
    token: string;
  }
>;

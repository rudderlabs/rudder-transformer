/** Reads `--name=value` off argv. Shared so the generator and the validator parse flags alike. */
export const argOf = (name: string): string | undefined =>
  process.argv.find((arg) => arg.startsWith(`--${name}=`))?.slice(name.length + 3);

/** Reads a bare `--name` flag off argv, for options that are present-or-absent. */
export const hasFlag = (name: string): boolean => process.argv.includes(`--${name}`);

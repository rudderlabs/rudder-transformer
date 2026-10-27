// Only leading-$ values are expressions. Everything else is a literal JSONata string.
// This host-side helper is shared by verification and the router; never import it into the isolate.
export function requestFieldExpression(value: string): string {
  // v1's enhanceMappings leaves pre-quoted single-quoted literals untouched. Migration
  // carries them verbatim, so preserve their evaluated value rather than quoting the quotes.
  if (value.startsWith("'") && value.endsWith("'") && value.length >= 2) return value;
  if (!value.startsWith('$')) return JSON.stringify(value);
  // Existing HTTP mappings use JSONPath-style $.field. JSONata binds the input event
  // under `message` for scalar fields; the body template instead binds $$.events.
  return value.startsWith('$.') ? `$$.message.${value.slice(2)}` : value;
}

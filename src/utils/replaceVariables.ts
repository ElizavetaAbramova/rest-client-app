import { VariableMap } from '@/hooks/useVariables';

export function applyVariables(input: unknown, vars: VariableMap): unknown {
  if (typeof input === 'string') {
    return input.replace(/\{\{(\w+)\}\}/g, (_, name) =>
      vars[name] !== undefined ? vars[name] : ''
    );
  }

  if (Array.isArray(input)) {
    return input.map((item) => applyVariables(item, vars));
  }

  if (typeof input === 'object' && input !== null) {
    const obj: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(input)) {
      obj[k] = applyVariables(v, vars);
    }
    return obj;
  }

  return input;
}

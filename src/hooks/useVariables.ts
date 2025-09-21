import { useEffect, useState } from 'react';

const STORAGE_KEY = 'app_variables';

export type VariableMap = Record<string, string>;

export function useVariables() {
  const [variables, setVariables] = useState<VariableMap>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setVariables(JSON.parse(raw));
      }
    } catch {
      setVariables({});
    }
  }, []);

  const save = (vars: VariableMap) => {
    setVariables(vars);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vars));
  };

  const addVariable = (key: string, value: string) => {
    save({ ...variables, [key]: value });
  };

  const removeVariable = (key: string) => {
    const copy = { ...variables };
    delete copy[key];
    save(copy);
  };

  return { variables, addVariable, removeVariable, setVariables: save };
}

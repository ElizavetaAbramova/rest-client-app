declare module 'postman-code-generators' {
  import { Request } from 'postman-collection';
  interface Options {
    indentCount?: number;
    indentType?: 'Space' | 'Tab';
    trimRequestBody?: boolean;
    followRedirect?: boolean;
    longFormat?: boolean;
    requestTimeout?: number;
  }

  interface Variant {
    key: string;
  }
  interface Language {
    key: string;
    label: string;
    syntax_mode: string;
    variants: Variant[];
  }

  type Callback = (error: Error | null, snippet: string) => void;

  export function convert(
    language: string,
    variant: string,
    request: Request,
    options: Options,
    callback: Callback
  ): void;

  export function getLanguageList(): Language[];
}

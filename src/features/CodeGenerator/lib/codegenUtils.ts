import { BaseSyntheticEvent } from 'react';
import { Header, Request } from 'postman-collection';
import { convert, Options } from 'postman-code-generators';
import type { Variant } from 'postman-code-generators';

export const defaultOptions: Options = {
  indentCount: 2,
  indentType: 'Space',
  trimRequestBody: true,
  followRedirect: true,
  longFormat: false,
  requestTimeout: 0,
};

export function copyToClipboard(
  code: string,
  setCopied: (val: boolean) => void
) {
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
  navigator.clipboard.writeText(code);
}

export function generateSnippet(
  language: string,
  variant: string,
  reqData: { url: string; method: string; headers: Header; body: string },
  setError: (val: boolean) => void,
  setCode: (val: string) => void,
  setArray: (val: string[]) => void
) {
  if (!reqData.url || !reqData.method) return;

  const request = new Request({
    url: reqData.url,
    method: reqData.method,
    header: reqData.headers,
    body: reqData.body,
  });

  convert(language, variant, request, defaultOptions, (error, snippet) => {
    if (error) {
      setError(true);
      console.error(error);
    } else {
      setError(false);
      setCode(snippet);
      setArray(snippet.split('\n'));
    }
  });
}

export function handleSelectLanguage(
  event: BaseSyntheticEvent,
  languages: { key: string; variants: Variant[] }[],
  setSelectedLanguage: (val: string) => void,
  setVariantDisable: (val: boolean) => void,
  setVariantsList: (val: Variant[]) => void,
  setSelectedVariant: (val: string) => void,
  handleGeneration: (language: string, variant: string) => void
) {
  const eventValue = event.target.value;
  const languageObj = languages.find((obj) => obj.key === eventValue);

  if (languageObj) {
    setSelectedLanguage(eventValue);
    setVariantDisable(false);
    setVariantsList(languageObj.variants);
    setSelectedVariant(languageObj.variants[0].key);
    handleGeneration(eventValue, languageObj.variants[0].key);
  }
}

export function handleSelectVariant(
  event: BaseSyntheticEvent,
  setSelectedVariant: (val: string) => void,
  selectedLanguage: string,
  handleGeneration: (language: string, variant: string) => void
) {
  const variant = event.target.value;
  setSelectedVariant(variant);
  handleGeneration(selectedLanguage, variant);
}

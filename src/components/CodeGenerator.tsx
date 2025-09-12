'use client';
import React, { BaseSyntheticEvent, useEffect, useState } from 'react';
import {
  convert,
  getLanguageList,
  Options,
  Variant,
} from 'postman-code-generators';
import { Request } from 'postman-collection';
import { useT } from '@/hooks/useT';
import { useUrlRequestState } from '@/hooks/useUrlRequestState';

function CodeGenerator() {
  const { t } = useT();
  const [generatedCode, setGeneratedCode] = useState('');
  const [generatedCodeArray, setGeneratedCodeArray] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedVariant, setSelectedVariant] = useState('');
  const [variantsList, setVariantsList] = useState<Variant[]>([]);
  const [isSelectVariantDisabled, setVariantDisable] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isError, setIsError] = useState(false);
  const languages = getLanguageList();
  const { url, method, body, headers } = useUrlRequestState();

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    navigator.clipboard.writeText(generatedCode);
  };

  const handleGeneration = (language: string, variant: string) => {
    if (!url || !method) return;

    const request = new Request({
      url: url,
      method: method,
      header: [
        {
          key: 'Content-Type',
          value: 'application/json',
        },
        ...headers,
      ],
      body: body,
    });

    const options: Options = {
      indentCount: 2,
      indentType: 'Space',
      trimRequestBody: true,
      followRedirect: true,
      longFormat: false,
      requestTimeout: 0,
    };

    convert(language, variant, request, options, (error, snippet) => {
      if (error) {
        setIsError(true);
        console.error(error);
      } else {
        setIsError(false);
        setGeneratedCode(snippet);
        setGeneratedCodeArray(snippet.split('\n'));
      }
    });
  };

  const handleSelectLanguage = (event: BaseSyntheticEvent) => {
    const eventValue = event.target.value;
    const languageObj = languages.find((obj) => obj.key === eventValue);

    if (languageObj) {
      setSelectedLanguage(eventValue);
      setVariantDisable(false);
      setVariantsList(languageObj.variants);
      setSelectedVariant(languageObj.variants[0].key);
      handleGeneration(eventValue, languageObj.variants[0].key);
    }
  };

  const handleSelectVariant = (event: BaseSyntheticEvent) => {
    const variant = event.target.value;
    setSelectedVariant(variant);
    handleGeneration(selectedLanguage, variant);
  };

  useEffect(() => {
    if (languages.length > 0 && selectedLanguage === '') {
      const firstLang = languages[0];
      const firstVariant = firstLang.variants[0].key;
      setSelectedLanguage(firstLang.key);
      setVariantsList(firstLang.variants);
      setVariantDisable(false);
      setSelectedVariant(firstVariant);
      handleGeneration(firstLang.key, firstVariant);
    }
  }, [languages]);

  useEffect(() => {
    if (!url || !method) return;
    handleGeneration(selectedLanguage, selectedVariant);
  }, [url, method, body, headers]);

  return (
    <div className="flex w-full min-w-3xs flex-col p-0 md:w-1/2 md:p-5 md:pt-0">
      <label className="pb-3 text-sm font-medium">
        {t('code_generator_label')}
      </label>
      <div className="flex w-full min-w-3xs flex-wrap justify-center gap-2 md:gap-0">
        <select
          value={selectedLanguage}
          className="select w-full min-w-[160px] rounded-xl border md:w-1/2"
          onChange={handleSelectLanguage}
          name="select-language"
          aria-label="select-language"
        >
          <option disabled={true}>Select a language</option>
          {languages.map((lang, index) => {
            return (
              <option key={index} value={lang.key}>
                {lang.label}
              </option>
            );
          })}
        </select>
        <select
          value={selectedVariant}
          className="select w-full min-w-[160px] rounded-xl border md:w-1/2"
          onChange={handleSelectVariant}
          disabled={isSelectVariantDisabled}
          name="select-variant"
          aria-label="select-variant"
        >
          <option disabled={true}>Select a variant</option>
          {variantsList.map((variant) => {
            return <option key={variant.key}>{variant.key}</option>;
          })}
        </select>
      </div>
      {isError && <p className="text-red-300">Error: incorrect request</p>}
      {generatedCode !== '' && (
        <div className="mockup-code mt-2 w-full rounded-xl pt-10 before:content-none">
          <button
            aria-label="copy-button"
            className="group absolute top-[5px] right-[5px] rounded-md bg-gray-800 p-2 text-white hover:bg-gray-700"
            onClick={handleCopy}
          >
            <svg
              id="Copy_24"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <rect
                width="24"
                height="24"
                stroke="none"
                fill="#000000"
                opacity="0"
              />
              <g transform="matrix(1.43 0 0 1.43 12 12)">
                <path
                  style={{
                    stroke: 'none',
                    strokeWidth: 1,
                    strokeDasharray: 'none',
                    strokeLinecap: 'butt',
                    strokeDashoffset: 0,
                    strokeLinejoin: 'miter',
                    strokeMiterlimit: 4,
                    fill: 'rgba(255, 255, 255, 1)',
                    fillRule: 'nonzero',
                    opacity: 1,
                  }}
                  transform=" translate(-8, -7.5)"
                  d="M 2.5 1 C 1.675781 1 1 1.675781 1 2.5 L 1 10.5 C 1 11.324219 1.675781 12 2.5 12 L 4 12 L 4 12.5 C 4 13.324219 4.675781 14 5.5 14 L 13.5 14 C 14.324219 14 15 13.324219 15 12.5 L 15 4.5 C 15 3.675781 14.324219 3 13.5 3 L 12 3 L 12 2.5 C 12 1.675781 11.324219 1 10.5 1 Z M 2.5 2 L 10.5 2 C 10.78125 2 11 2.21875 11 2.5 L 11 10.5 C 11 10.78125 10.78125 11 10.5 11 L 2.5 11 C 2.21875 11 2 10.78125 2 10.5 L 2 2.5 C 2 2.21875 2.21875 2 2.5 2 Z M 12 4 L 13.5 4 C 13.78125 4 14 4.21875 14 4.5 L 14 12.5 C 14 12.78125 13.78125 13 13.5 13 L 5.5 13 C 5.21875 13 5 12.78125 5 12.5 L 5 12 L 10.5 12 C 11.324219 12 12 11.324219 12 10.5 Z"
                  strokeLinecap="round"
                />
              </g>
            </svg>
            <span className="invisible absolute top-[7px] right-[45px] w-[100px] text-end group-hover:visible">
              {copied ? 'Copied!' : 'Copy code'}
            </span>
          </button>
          {generatedCodeArray.map((str, idx) => {
            return (
              <pre key={idx} data-prefix={idx + 1}>
                <code>{str}</code>
              </pre>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CodeGenerator;

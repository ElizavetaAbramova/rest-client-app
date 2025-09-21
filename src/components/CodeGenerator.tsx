'use client';
import React, { BaseSyntheticEvent, useEffect, useState } from 'react';
import { getLanguageList, Variant } from 'postman-code-generators';
import { useT } from '@/hooks/useT';
import { useUrlRequestState } from '@/hooks/useUrlRequestState';
import {
  copyToClipboard,
  generateSnippet,
  handleSelectLanguage,
  handleSelectVariant,
} from '@/features/CodeGenerator/lib/codegenUtils';

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

  const handleCopy = () => copyToClipboard(generatedCode, setCopied);

  const handleGeneration = (language: string, variant: string) =>
    generateSnippet(
      language,
      variant,
      { url, method, headers, body },
      setIsError,
      setGeneratedCode,
      setGeneratedCodeArray
    );

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
          onChange={(e: BaseSyntheticEvent) =>
            handleSelectLanguage(
              e,
              languages,
              setSelectedLanguage,
              setVariantDisable,
              setVariantsList,
              setSelectedVariant,
              handleGeneration
            )
          }
          name="select-language"
          aria-label="select-language"
        >
          <option disabled={true}>Select a language</option>
          {languages.map((lang, index) => (
            <option key={index} value={lang.key}>
              {lang.label}
            </option>
          ))}
        </select>
        <select
          value={selectedVariant}
          className="select w-full min-w-[160px] rounded-xl border md:w-1/2"
          onChange={(e: BaseSyntheticEvent) =>
            handleSelectVariant(
              e,
              setSelectedVariant,
              selectedLanguage,
              handleGeneration
            )
          }
          disabled={isSelectVariantDisabled}
          name="select-variant"
          aria-label="select-variant"
        >
          <option disabled={true}>Select a variant</option>
          {variantsList.map((variant) => (
            <option key={variant.key}>{variant.key}</option>
          ))}
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
            <svg id="Copy_24" width="24" height="24" viewBox="0 0 24 24">
              <rect width="24" height="24" fill="#000000" opacity="0" />
              <g transform="matrix(1.43 0 0 1.43 12 12)">
                <path
                  d="M 2.5 1 C 1.675781 1 1 1.675781 1 2.5 L 1 10.5 C 1 11.324219 1.675781 12 2.5 12 L 4 12 L 4 12.5 C 4 13.324219 4.675781 14 5.5 14 L 13.5 14 C 14.324219 14 15 13.324219 15 12.5 L 15 4.5 C 15 3.675781 14.324219 3 13.5 3 L 12 3 L 12 2.5 C 12 1.675781 11.324219 1 10.5 1 Z"
                  fill="white"
                />
              </g>
            </svg>
            <span className="invisible absolute top-[7px] right-[45px] w-[100px] text-end group-hover:visible">
              {copied ? 'Copied!' : 'Copy code'}
            </span>
          </button>
          {generatedCodeArray.map((str, idx) => (
            <pre key={idx} data-prefix={idx + 1}>
              <code>{str}</code>
            </pre>
          ))}
        </div>
      )}
    </div>
  );
}

export default CodeGenerator;

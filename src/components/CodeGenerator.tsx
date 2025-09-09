'use client';
import React, { useState } from 'react';
import { convert, getLanguageList } from 'postman-code-generators';
import { Request } from 'postman-collection';

interface Props {
  url: string;
  method: 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
}

function CodeGenerator(prop: Props) {
  const [generatedCode, setGeneratedCode] = useState('');
  const languages = getLanguageList();
  console.log(languages);

  const handle = () => {
    const request = new Request({
      url: prop.url,
      method: prop.method,
      header: [
        {
          key: 'Content-Type',
          value: 'application/json',
        },
      ],
      body: {
        mode: 'raw',
        raw: JSON.stringify({ title: 'foo', body: 'bar', userId: 1 }),
      },
    });

    const options = {
      indentCount: 2,
      indentType: 'Space',
      trimRequestBody: true,
      followRedirect: true,
      longFormat: false,
      requestTimeout: 0,
    };

    console.log(prop.method);

    convert('curl', 'cURL', request, options, (error, snippet) => {
      if (error) {
        console.error(error);
      } else {
        setGeneratedCode(snippet);
        console.log('Generated code:\n', snippet);
      }
    });
  };

  return (
    <div>
      <h2 onClick={handle}>Code</h2>
      <select onChange={(event) => console.log(event.target.value)}>
        {languages.map((lang, index) => {
          return (
            <option key={index} value={lang}>
              {lang.label}
            </option>
          );
        })}
      </select>
      <div>
        <pre>
          <code>{generatedCode}</code>
        </pre>
      </div>
    </div>
  );
}

export default CodeGenerator;

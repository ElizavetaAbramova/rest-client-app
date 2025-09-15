import { useEffect, useState } from 'react';
import { decodeBase64Url } from '@/utils/base64url';
import { getHashParam } from '@/utils/hashParams';
import { Row } from '../../types/Row';

export function useUrlRequestState() {
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [body, setBody] = useState('');
  const [headers, setHeaders] = useState<Row[]>([{ key: '', value: '' }]);

  const parseStateFromUrl = () => {
    try {
      const methodEnc = getHashParam('m');
      const urlEnc = getHashParam('u');
      const bodyEnc = getHashParam('b');
      const headersEnc = getHashParam('h');
      const headersDecoded = headersEnc
        ? JSON.parse(decodeBase64Url(headersEnc))
        : [];
      const headersFormatted: Row[] = headersDecoded.map(
        ({ k, v }: { k: string; v: string }) => ({
          key: k,
          value: v,
        })
      );

      setMethod(methodEnc ? decodeBase64Url(methodEnc).toUpperCase() : 'GET');
      setUrl(urlEnc ? decodeBase64Url(urlEnc) : '');
      setBody(bodyEnc ? decodeBase64Url(bodyEnc) : '');
      setHeaders(headersFormatted);
    } catch {
      console.warn('Invalid URL state, ignored');
    }
  };

  useEffect(() => {
    parseStateFromUrl();
    const onHashChange = () => parseStateFromUrl();
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return { url, method, body, headers };
}

'use client';
import RequestLine from '@/components/RequestLine';
import HeadersEditor from '@/components/HeadersEditor';
import Body from '@/components/Body';
import RequestRunner from '@/widgets/RequestRunner/ui/RequestRunner';
import CodeGenerator from '@/components/CodeGenerator';
import { useEffect, useState } from 'react';
import { Method } from '../../../types/Method';
import { useUserId } from '@/hooks/useUserId';
import { Row } from '../../../types/Row';
import { getRawHash } from '@/utils/hashParams';
import { RespData, RespError } from '@/entities/request/model/types';

const saveInDb = (
  user: string,
  method: Method,
  encodedUrl: string,
  body: string,
  headers: Row[],
  requestSize: number,
  resp: RespData | null,
  url: string,
  error: string | null = null
) => {
  fetch('/api/requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: user,
      method,
      url: encodedUrl,
      request_body: body,
      request_headers: headers,
      request_size: requestSize,
      response_size: resp?.sizeBytes ?? 0,
      status_code: resp?.status,
      duration_ms: resp?.timeMs,
      error: error,
      api_url: url,
    }),
  });
};

export default function ClientPage() {
  const user = useUserId().userId;
  const [method, setMethod] = useState<Method>('GET');
  const [url, setUrl] = useState('');
  const [body, setBody] = useState('');
  const [requestSize, setRequestSize] = useState(0);
  const [headers, setHeaders] = useState<Row[]>([{ key: '', value: '' }]);
  const [resp, setResponse] = useState<RespData | null>(null);
  const [errorDetails, setErrorDetails] = useState<RespError | null>(null);

  const handleResponse = (response: RespData) => {
    setErrorDetails(null);
    setResponse(response);
  };
  const handleError = (error: RespError | null) => {
    setResponse(null);
    setErrorDetails(error);
  };

  useEffect(() => {
    if (!errorDetails && !resp) return;
    const encodedUrl = getRawHash();

    saveInDb(
      user,
      method,
      encodedUrl,
      body,
      headers,
      requestSize,
      resp,
      url,
      errorDetails?.message
    );
  }, [resp, errorDetails]);

  return (
    <div className="bg-base-400 space-y-4 p-4">
      <RequestLine setUrlProp={setUrl} setMethodProp={setMethod} />
      <HeadersEditor setHeadersProp={setHeaders} />
      <div className="flex flex-wrap">
        <Body setBody={setBody} setRequestSize={setRequestSize} />
        <CodeGenerator />
      </div>
      <RequestRunner onResponse={handleResponse} onError={handleError} />
    </div>
  );
}

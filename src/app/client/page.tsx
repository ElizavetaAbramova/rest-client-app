'use client';
import RequestLine from '@/components/RequestLine';
import HeadersEditor from '@/components/HeadersEditor';
import Body from '@/components/Body';
import RequestRunner from '@/widgets/RequestRunner/ui/RequestRunner';
import CodeGenerator from '@/components/CodeGenerator';
import { useState } from 'react';
import { Method } from '../../../types/Method';
import { Row } from '../../../types/Row';

export default function ClientPage() {
  const [method, setMethod] = useState<Method>('GET');
  const [url, setUrl] = useState('');
  const [body /*, setBody*/] = useState('');
  const [headers /*, setHeaders*/] = useState<Row[]>([{ key: '', value: '' }]);

  // const { url, method, body, headers } = useUrlRequestState();
  const saveInDb = () => {
    //save in history (request in data base)
    console.log('save', method, url, body, headers);
    // Request Duration (Latency) - duration_ms
    // Response Status Code - status_code
    // Request Timestamp - created_at
    // Request Size - request_size
    // Response Size - response_size
    // Error Details - error
    // user id
  };

  return (
    <div className="bg-base-400 space-y-4 p-4">
      <RequestLine
        onSendRequest={() => saveInDb()}
        setUrlProp={setUrl}
        setMethodProp={setMethod}
      />
      <HeadersEditor />
      <div className="flex flex-wrap">
        <Body />
        <CodeGenerator />
      </div>
      <RequestRunner />
    </div>
  );
}

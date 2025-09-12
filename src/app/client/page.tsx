'use client';
import RequestLine from '@/components/RequestLine';
import HeadersEditor from '@/components/HeadersEditor';
import Body from '@/components/Body';
import RequestRunner from '@/components/RequestRunner';
import CodeGenerator from '@/components/CodeGenerator';

export default function ClientPage() {
  return (
    <div className="space-y-4 p-4">
      <RequestLine />
      <HeadersEditor />
      <div className="flex flex-wrap">
        <Body />
        <CodeGenerator
          url="https://dummyjson.com/test"
          method="GET"
          json=""
          headers={[{ key: '', value: '' }]}
        />
      </div>
      <RequestRunner />
    </div>
  );
}

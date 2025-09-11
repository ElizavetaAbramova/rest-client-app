'use client';
import RequestLine from '@/components/RequestLine';
import HeadersEditor from '@/components/HeadersEditor';
import Body from '@/components/Body';
import RequestRunner from '@/components/RequestRunner';

export default function ClientPage() {
  return (
    <div className="space-y-4 p-4">
      <RequestLine />
      <HeadersEditor />
      <Body />
      <RequestRunner />
    </div>
  );
}

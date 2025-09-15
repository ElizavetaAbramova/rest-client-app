import { decodeBase64Url } from '@/utils/base64url';
import { getHashParam } from '@/utils/hashParams';
import { parseHeaders } from './parseHeaders';

export type RequestState = {
  method: string;
  url: string;
  body: string;
  headersObj: Record<string, string>;
};

export function readHashState(): RequestState {
  const mEnc = getHashParam('m');
  const uEnc = getHashParam('u');
  const bEnc = getHashParam('b');
  const hEnc = getHashParam('h');

  const method = mEnc ? decodeBase64Url(mEnc).toUpperCase() : 'GET';
  const url = uEnc ? decodeBase64Url(uEnc) : '';
  const body = bEnc ?? '';
  const headersObj = parseHeaders(hEnc);

  return { method, url, body, headersObj };
}

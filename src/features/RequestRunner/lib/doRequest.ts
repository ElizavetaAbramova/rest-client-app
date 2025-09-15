import { RespData } from '@/entities/request/model/types';

const PREVIEW_LIMIT = 200 * 1024;
const TIMEOUT_MS = 15000;

export async function doRequest(
  url: string,
  init: RequestInit,
  showAll: boolean,
  ac: AbortController
): Promise<RespData> {
  const t0 = performance.now();
  const to = setTimeout(() => ac.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, init);
    const t1 = performance.now();

    const headersArr = Array.from(res.headers.entries());
    const ct = res.headers.get('content-type') || '';
    const cl = res.headers.get('content-length');
    const isJson = /\bapplication\/json\b/i.test(ct);
    const isText =
      isJson ||
      /\b(text\/|application\/(xml|javascript|x-www-form-urlencoded))\b/i.test(
        ct
      );

    let isBinary = false;
    let bodyText = '';
    let buf: ArrayBuffer | null = null;

    if (isText) {
      try {
        bodyText = await res.text();
      } catch {
        isBinary = true;
      }
    } else {
      isBinary = true;
      buf = await res.arrayBuffer();
    }

    const size =
      typeof cl === 'string'
        ? Number(cl) || (buf ? buf.byteLength : bodyText.length)
        : buf
          ? buf.byteLength
          : bodyText.length;

    let pretty = bodyText;
    if (isJson && !isBinary && bodyText) {
      try {
        const obj = JSON.parse(bodyText);
        pretty = JSON.stringify(obj, null, 2);
      } catch (e) {
        console.error(e);
      }
    }

    const truncated = !showAll && !isBinary && pretty.length > PREVIEW_LIMIT;
    const preview = truncated
      ? pretty.slice(0, PREVIEW_LIMIT) + '\n…[truncated]'
      : pretty;

    let downloadUrl: string | undefined;
    if (isBinary && buf) {
      const blob = new Blob([buf]);
      downloadUrl = URL.createObjectURL(blob);
    }

    return {
      status: res.status,
      statusText: res.statusText,
      timeMs: Math.max(0, Math.round(t1 - t0)),
      sizeBytes: size,
      headers: headersArr,
      isJson,
      isText: !isBinary,
      isBinary,
      truncated,
      bodyText: isBinary ? '' : preview,
      downloadUrl,
      bodyFullText: isBinary ? '' : pretty,
    };
  } finally {
    clearTimeout(to);
  }
}

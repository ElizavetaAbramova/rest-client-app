import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const {
    user_id,
    method,
    url,
    request_body,
    request_headers,
    request_size,
    response_size,
    status_code,
    duration_ms,
    error,
    api_url,
  } = await req.json();

  try {
    await pool.query(
      `INSERT INTO requests
          (user_id, method, url, request_body, request_headers, request_size, response_size, status_code, duration_ms, error, created_at, api_url)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW(),$11)`,
      [
        user_id,
        method,
        url,
        JSON.stringify(request_body || {}),
        JSON.stringify(request_headers || []),
        request_size || 0,
        response_size || 0,
        status_code || 0,
        duration_ms || 0,
        error || null,
        api_url,
      ]
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

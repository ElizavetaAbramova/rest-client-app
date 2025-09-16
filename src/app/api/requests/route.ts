import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
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
    } = req.body;

    try {
      await pool.query(
        `INSERT INTO requests
          (user_id, method, url, request_body, request_headers, request_size, response_size, status_code, duration_ms, error, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW())`,
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
        ]
      );
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

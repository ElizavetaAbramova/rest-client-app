import { NextApiRequest } from 'next';
import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
  req: NextApiRequest,
  { params }: { params: { userId: string } }
) {
  const { userId } = await params;

  try {
    const result = await pool.query(
      `SELECT * FROM requests WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({
        requests: [],
        message: 'No history requests',
      });
    }

    return NextResponse.json({ requests: result.rows });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

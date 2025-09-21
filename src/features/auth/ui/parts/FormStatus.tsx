'use client';

export function FormStatus({
  error,
  info,
}: {
  error?: string | null;
  info?: string | null;
}) {
  return (
    <div className="min-h-5">
      {error && <p className="text-sm text-red-400">{error}</p>}
      {info && <p className="text-sm text-emerald-400">{info}</p>}
    </div>
  );
}

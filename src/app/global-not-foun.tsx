import Link from 'next/link';
import './globals.css';
import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'Page does not exist',
};

export default function GlobalNotFound() {
  return (
    <html lang="ru">
      <body className="hero bg-base-300 min-h-screen">
        <div className="page-404 bg-base-300 flex h-full flex-col items-center justify-center gap-10 pt-10 pb-10">
          <Image
            src="/404.png"
            width={300}
            height={300}
            alt="page-not-found image"
            className="image-404"
            priority
          ></Image>
          <h3 className="text-center text-xl">
            Sorry, page not found. Probably wrong URL. Probably page stolen by
            aliens.
          </h3>
          <Link
            href="/"
            className="btn btn-secondary btn-soft rounded-sm text-lg"
          >
            Back to home
          </Link>
        </div>
      </body>
    </html>
  );
}
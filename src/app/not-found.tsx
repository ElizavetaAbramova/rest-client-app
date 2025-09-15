import Link from 'next/link';
import Image from 'next/image';

export default function Page() {
  return (
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
      <Link href="/" className="btn btn-secondary btn-soft rounded-sm text-lg">
        Back to home
      </Link>
    </div>
  );
}

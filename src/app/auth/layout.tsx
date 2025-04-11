import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

// Import the image directly if using a local image
import authBanner from '../../../public/assets/images/auth-banner.jpg';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col">
      <nav className="py-4 text-xl font-semibold tracking-wider shadow-md">
        <div className="container">
          <Link href="/" className="ml-2 text-xl font-bold">
            PFMS
          </Link>
        </div>
      </nav>
      <section className="container !mb-auto !mt-auto flex items-center justify-between gap-8 lg:flex-row">
        <div className="w-full lg:w-1/2 lg:px-20 lg:py-4">{children}</div>
        <div className="hidden lg:flex lg:w-1/2">
          <Image
            src={authBanner}
            alt="Auth Banner"
            priority
            quality={100}
            placeholder="blur"
            className="rounded-lg object-cover"
          />
        </div>
      </section>
    </main>
  );
}

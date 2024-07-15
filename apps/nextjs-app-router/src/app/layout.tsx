import Head from 'next/head';
import * as React from 'react';

import { Providers } from './providers';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
        <meta content="!" name="fragment" />
        <meta content="#0077CC" name="theme-color" />
        <link href="/manifest.json" rel="manifest" />
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

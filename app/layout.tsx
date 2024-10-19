import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
const inter = Inter({ subsets: ["latin"] });

import Navbar from '@/components/mycomponents/Navbar';

export const metadata: Metadata = {
  title: 'WatchYo',
  description:
    'WatchYo is a platform for discovering and streaming movies, TV shows, and anime online',
  openGraph: {
    title: 'WatchYo - Your Ultimate Entertainment Hub',
    description:
      'Discover, stream, and explore movies, TV shows, and anime with WatchYo. Experience entertainment like never before.',
    images: [
      {
        url: 'https://watchyo.vercel.app/wlogo.png', // Ensure this URL is correct and accessible
        width: 1200,
        height: 630,
        alt: 'WatchYo Logo',
      },
    ],
    siteName: 'WatchYo',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@WatchYo',
    site: '@WatchYo',
  },
  icons: {
    icon: '/favicon.png', // Add this line to specify the favicon
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <div className='fixed inset-0 w-screen h-screen bg-[linear-gradient(to_right,#444_1px,transparent_0.2px),linear-gradient(to_bottom,#444_1px,transparent_0.3px)] bg-[size:4rem_4rem] opacity-5 dark:opacity-10 pointer-events-none'></div>
          <main className='container mx-auto px-4 sm:px-6 py-2 relative z-10'>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}

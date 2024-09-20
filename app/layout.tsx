import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
const inter = Inter({ subsets: ["latin"] });

import Navbar from '@/components/mycomponents/Navbar';

export const metadata: Metadata = {
  title: "EloRate",
  description: "Let's Elo rate everything",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="container mx-auto px-4 sm:px-6 py-2">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}

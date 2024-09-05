import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/ModeToggle";
const inter = Inter({ subsets: ["latin"] });

import { Button } from '@/components/ui/button';
import { ChevronRight, Home, House } from "lucide-react";

import Navbar from '@/components/mycomponents/Navbar';

export const metadata: Metadata = {
  title: "EloRate",
  description: "lets elo rate everything", 
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

          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

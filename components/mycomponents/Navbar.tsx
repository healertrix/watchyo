'use client';

import { User, Settings, Menu, X } from "lucide-react";
import { ModeToggle } from "../ModeToggle";
import { Button } from "../ui/button";
import Link from "next/link";

// Update the logo component name and SVG if needed
function RateWiseLogo() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function Navbar() {
  return (
    <nav className='flex justify-between items-center w-full p-2 sm:p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50'>
      <Link href='/' className='flex items-center space-x-2'>
        <RateWiseLogo />
        <span className='font-semibold text-lg hidden sm:inline'>WatchWise</span>
      </Link>

      <div className='flex items-center'>
        <ModeToggle  />
      </div>
    </nav>
  );
}

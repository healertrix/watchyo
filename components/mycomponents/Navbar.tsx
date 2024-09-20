'use client';

import { User, Settings, Menu, X } from "lucide-react";
import { ModeToggle } from "../ModeToggle";
import { Button } from "../ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";

// Add this new component for the logo
function EloRateLogo() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Close menu when resizing to larger screen
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 640) { // sm breakpoint
                setIsMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
      <nav className='flex justify-between items-center w-full p-2 sm:p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50'>
        <Link href='/' className="flex items-center space-x-2">
          <EloRateLogo />
          <span className="font-semibold text-lg hidden sm:inline">EloRate</span>
        </Link>
        
        <div className="hidden sm:flex items-center space-x-4">
          <NavLink href='/profile' icon={<User className='h-4 w-4' />} label="Profile" />
          <NavLink href='/settings' icon={<Settings className='h-4 w-4' />} label="Settings" />
          <ModeToggle />
        </div>

        <div className="sm:hidden">
          <Button variant='ghost' size='sm' onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
          </Button>
        </div>

        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-background border-t border-border shadow-lg p-4 sm:hidden">
            <NavLink href='/profile' icon={<User className='h-4 w-4' />} label="Profile" />
            <NavLink href='/settings' icon={<Settings className='h-4 w-4' />} label="Settings" />
            <div className="mt-4 flex justify-center">
              <ModeToggle />
            </div>
          </div>
        )}
      </nav>
    );
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="block mb-2 last:mb-0">
      <Button variant='ghost' size='sm' className='flex items-center space-x-2 w-full justify-start'>
        {icon}
        <span>{label}</span>
      </Button>
    </Link>
  );
}


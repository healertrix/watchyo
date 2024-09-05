import { Home } from "lucide-react";
import { ModeToggle } from "../ModeToggle";
import { Button } from "../ui/button";
import Link from "next/link";

export default function Navbar() {
    return (
      <div className='flex justify-between items-center w-full'>
        <Button
          variant='outline'
          size='icon'
          className='h-8 w-8 sm:h-9 sm:w-9 mx-4 my-2'
        >
          <Link href='./'>
            <Home className='h-4 w-4' />
          </Link>
        </Button>
        <ModeToggle />
      </div>
    );
}


import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import Image from 'next/image';
import mcdPic from '@/public/mcd.jpg';
import Restaurant from '@/lib/restaurant';
import { Button } from '../ui/button';
import Link from 'next/link';
import { MoveUp, MoveDown, ExternalLink } from 'lucide-react';
import { Link as LucideLink } from 'lucide-react';

export default function ResturantCard() {
  const mcd = new Restaurant(
    "McDonald's",
    'Fast Food',
    3.5,
    '123-456-7890',
    'https://www.mcdonalds.com',
    '123 Main St, Anytown, USA'
  );
  return (
    <Card className='flex flex-col md:flex-row h-auto m-4'>
      <div className='flex flex-col w-full md:w-3/5'>
        <CardHeader className='p-4'>
          <CardTitle>{mcd.name}</CardTitle>
          <div className='flex flex-row'>
            <CardDescription>{mcd.category}</CardDescription>
            <Link href={mcd.website} className='mx-3' target='_blank'>
              <ExternalLink className='h-4 w-4' />
            </Link>
          </div>
        </CardHeader>
        <CardContent className='p-4 flex-grow'>
          <p>Address: {mcd.fullAddress}</p>
          <p>Phone: {mcd.phoneNumber}</p>
          <p>Rating: {mcd.rating}</p>
        </CardContent>
        <CardFooter className='p-4'>
          <Button variant='outline' size='icon'>
            <MoveUp className='h-4 w-4' color='green' />
          </Button>
          <Button variant='outline' size='icon' className='mx-4'>
            <MoveDown className='h-4 w-4' color='red' />
          </Button>
        </CardFooter>
      </div>

      <div className='w-full h-32 md:w-2/5 md:h-auto relative'>
        <Image
          src={mcdPic}
          alt='McDonalds'
          fill={true}
          placeholder='blur'
          style={{ objectFit: 'cover' }}
          className='rounded-b-lg md:rounded-r-lg md:rounded-bl-none'
        />
      </div>
    </Card>
  );
}

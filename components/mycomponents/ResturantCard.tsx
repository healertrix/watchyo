import React from 'react';
import { Card } from '@/app/lib/elo';
import Image from 'next/image';
import { Link, Phone } from 'lucide-react';

interface RestaurantCardProps {
  restaurant: Card;
  showElo?: boolean;
  eloColor?: string;
  showDetails?: boolean;
  isComparison?: boolean;
}

export default function RestaurantCard({ 
  restaurant, 
  showElo = true, 
  eloColor = 'text-white',
  showDetails = false,
  isComparison = false
}: RestaurantCardProps) {
  return (
    <div className='flex flex-col h-full'>
      <div className='relative w-full h-24 mb-2'>
        <Image
          src={restaurant.imageLink || '/placeholder.jpg'}
          alt={restaurant.name}
          layout='fill'
          objectFit='cover'
          className='rounded-t-lg'
        />
      </div>
      <div className='flex-grow'>
        <h3 className='text-lg font-semibold mb-1'>{restaurant.name}</h3>
        <p className='text-sm text-gray-500 mb-1'>{restaurant.category}</p>
        {showElo && (
          <p className={`text-sm font-bold ${eloColor}`}>
            {isComparison ? "EloRate" : "ELO Rating"}: {Math.round(restaurant.elorating)}
          </p>
        )}
        {showDetails && (
          <>
            <p className='text-sm text-gray-500 mb-1 truncate'>
              <Phone className='inline w-4 h-4 mr-1' />
              {restaurant.phoneNumber}
            </p>
            <p className='text-sm text-gray-500 mb-1 truncate'>
              {restaurant.fullAddress}
            </p>
          </>
        )}
        {restaurant.website && (
          <a 
            href={restaurant.website} 
            target="_blank" 
            rel="noopener noreferrer" 
            className='text-sm text-blue-500 hover:underline flex items-center'
          >
            <Link className='w-4 h-4 mr-1' />
            Website
          </a>
        )}
      </div>
    </div>
  );
}

'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Trophy } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Restaurant from '@/lib/restaurant';
import { RestaurantSchema } from '@/lib/db.types';
import { z } from 'zod';
type RestaurantCardProps = {
  restaurant: z.infer<typeof RestaurantSchema>;
};

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const [isFilled, setIsFilled] = useState(false);

  const handleClick = () => setIsFilled((prevIsFilled) => !prevIsFilled);
  console.log(restaurant, 'restaurant in the card file');
  return (
    <Card className="flex flex-col md:flex-row h-auto m-4">
      <div className="flex flex-col w-full md:w-3/5">
        <CardHeader className="p-4">
          <CardTitle>{restaurant.name}</CardTitle>
          <div className="flex flex-row items-center">
            <CardDescription>{restaurant.category}</CardDescription>
            <Link
              href={restaurant.website}
              className="ml-3"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <p>Address: {restaurant.fullAddress}</p>
          <p>Phone: {restaurant.phoneNumber}</p>
          <p>Rating: {restaurant.rating}</p>
        </CardContent>
        <CardFooter className="p-4">
          <Button variant="outline" size="icon"
            onClick={handleClick}
          >
            <Trophy
              className="h-4 w-4"
              color="gold"
              fill=
              {isFilled ?
              "gold"
                 : "none"}
            />
          </Button>
        </CardFooter>
      </div>

      <div className="w-full h-32 md:w-2/5 md:h-auto relative">
        <Image
          src={restaurant.imageLink}
          alt={restaurant.name}
          fill={true}
          style={{ objectFit: "cover" }}
          className="rounded-b-lg md:rounded-r-lg md:rounded-bl-none"
        />
      </div>
    </Card>
  );
}

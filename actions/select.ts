import { db } from "@/db/drizzle";
import { restaurants, SelectRestaurant } from '@/db/schema';

export const getAllRestaurants = async (): Promise<SelectRestaurant[]>=> {
  const data = await db.select().from(restaurants);
  return data;
}
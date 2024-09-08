import { db } from "@/db/drizzle";
import { restaurants, SelectRestaurant } from '@/db/schema';
import { revalidatePath } from "next/cache";

export const getAllRestaurants = async (): Promise<SelectRestaurant[]>=> {
    const data = await db.select().from(restaurants);
    revalidatePath('/test');
    return data;
    
}
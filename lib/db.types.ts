import { z } from 'zod';
import { createInsertSchema } from 'drizzle-zod';
import { restaurants } from '@/db/schema'; // Adjust the import path as needed

export const RestaurantSchema = createInsertSchema(restaurants, {
  name: z
    .string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
    })
    .trim()
    .min(1, { message: 'Name is too short' })
    .max(100, { message: 'Name is too long' }),
  category: z
    .string({
      required_error: 'Category is required',
      invalid_type_error: 'Category must be a string',
    })
    .trim()
    .min(1, { message: 'Category is too short' })
    .max(50, { message: 'Category is too long' }),
  rating: z
    .number({
      required_error: 'Rating is required',
      invalid_type_error: 'Rating must be a number',
    })
    .min(0, { message: 'Rating must be at least 0' })
    .max(5, { message: 'Rating must be at most 5' }),
  phoneNumber: z
    .string({
      required_error: 'Phone number is required',
      invalid_type_error: 'Phone number must be a string',
    })
    .trim()
    .min(7, { message: 'Phone number is too short' })
    .max(15, { message: 'Phone number is too long' }),
  website: z.string().trim().url({ message: 'Invalid URL format' }),
  fullAddress: z
    .string({
      required_error: 'Full address is required',
      invalid_type_error: 'Full address must be a string',
    })
    .trim()
    .min(5, { message: 'Full address is too short' })
    .max(500, { message: 'Full address is too long' }),
  imageLink: z
    .string()
    .trim()
    .url({ message: 'Invalid URL format' })
    ,
  elorating: z
    .number({
      required_error: 'Elo rating is required',
      invalid_type_error: 'Elo rating must be a number',
    })
    .min(0, { message: 'Elo rating must be at least 0' })
    .max(10000, { message: 'Elo rating must be at most 10000' }),
}).omit({ id: true, createdAt: true, updatedAt: true });

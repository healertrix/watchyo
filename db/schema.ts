import {
  integer,
  text,
  boolean,
  pgTable,
  serial,
  varchar,
  real,
  timestamp,
} from 'drizzle-orm/pg-core';

export const todo = pgTable('todo', {
  id: integer('id').primaryKey(),
  text: text('text').notNull(),
  done: boolean('done').default(false).notNull(),
});

export const restaurants = pgTable('restaurants', {
  id: serial('id').primaryKey(), // Automatically increments in PostgreSQL
  name: varchar('name', { length: 100 }).notNull(), // Max length 100 characters
  category: varchar('category', { length: 50 }).notNull(), // Max length 50 characters
  rating: real('rating').notNull(), // Rating, constraint added separately
  phoneNumber: varchar('phone_number', { length: 15 }).notNull(), // 15 for standard international format
  website: varchar('website', { length: 200 }).notNull(), // Max length 200 characters for URLs
  fullAddress: varchar('full_address', { length: 500 }).notNull(), // Increased to 500 characters for longer addresses
  imageLink: varchar('image_link', { length: 512 }).notNull(), // Increased to 512 characters for longer image URLs
  elorating: real('elorating').notNull().default(1000),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
export type SelectRestaurant = typeof restaurants.$inferSelect;
export type InsertRestaurant = typeof restaurants.$inferInsert;


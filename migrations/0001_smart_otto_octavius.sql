CREATE TABLE IF NOT EXISTS "restaurants" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"category" varchar(50) NOT NULL,
	"rating" real NOT NULL,
	"phone_number" varchar(15) NOT NULL,
	"website" varchar(200),
	"full_address" varchar(500) NOT NULL,
	"image_link" varchar(512),
	"elorating" real DEFAULT 1000 NOT NULL
);

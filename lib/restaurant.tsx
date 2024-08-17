export default class Restaurant {
  name: string;
  cuisine: string;
  rating: number;
  fullAddress: string;
  location: string;
  phoneNumber: string;
  website: string;
  constructor(
    name: string,
    cuisine: string,
    rating: number,
    location: string,
    phoneNumber: string,
    website: string,
    fullAddress: string
  ) {
    this.name = name;
    this.cuisine = cuisine;
    this.rating = rating;
    this.location = location;

    this.phoneNumber = phoneNumber;
    this.website = website;
    this.fullAddress = fullAddress;
  }

  display() {
    console.log(
      `${this.name} is a ${this.cuisine} restaurant with a rating of ${this.rating}`
    );
  }
}
const mcd = new Restaurant( 
    "McDonald's",
    "Fast Food",
    3.5,
    "123 Main St",
    "123-456-7890",
    "https://www.mcdonalds.com",
    "123 Main St, Anytown, USA"
);
mcd.display();
export default class Restaurant {
  name: string;
  category: string;
  rating: number;
  fullAddress: string;
  phoneNumber: string;
  website: string;
  imageLink: string;
  constructor(
    name: string,
    category: string,
    rating: number,
    phoneNumber: string,
    website: string,
    fullAddress: string,
    imageLink: string
  ) {
    this.name = name;
    this.category = category;
    this.rating = rating;

    this.phoneNumber = phoneNumber;
    this.website = website;
    this.fullAddress = fullAddress;
    this.imageLink = imageLink;
  }

  display() {
    console.log(
      `${this.name} is a ${this.category} restaurant with a rating of ${this.rating}`
    );
  }
}
const mcd = new Restaurant( 
    "McDonald's",
    "Fast Food",
    3.5,
    "123-456-7890",
    "https://www.mcdonalds.com",
  "123 Main St, Anytown, USA",
  "https://www.mcdonalds.com"
    
);
mcd.display();
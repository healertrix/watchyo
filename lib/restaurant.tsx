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

  
}


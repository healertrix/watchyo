import ResturantCard from '@/components/mycomponents/ResturantCard';
import Restaurant from '@/lib/restaurant';
export default function HomePage() {
  // const mcd = new Restaurant(
  //   "McDonald's",
  //   'Fast Food',
  //   3.5,
  //   '123 Main St',
  //   '123-456-7890',
  //   'https://www.mcdonalds.com',
  //   '123 Main St, Anytown, USA'
  // );
  // mcd.display();
  // console.log('Hello from the home page!');

  return (
    <div>
      <ResturantCard></ResturantCard>
      <ResturantCard></ResturantCard>
    </div>
  );
}

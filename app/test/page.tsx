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
const mcd = new Restaurant(
  "McDonald's",
  'Fast Food',
  3.5,
  '123-456-7890',
  'https://www.mcdonalds.com',
  '123 Main St, Anytown, USA',
  'https://lh3.googleusercontent.com/p/AF1QipO4YCV1zTXer5FOi7iUS0a8YtPUoyAWoObJ3ppC=s1360-w1360-h1020'
);
const kfc = new Restaurant(
  'KFC',
  'Fast Food',
  4.5,
  '123-456-7890',
  'https://www.kfc.com',
  '45 Main St, Minneapolis, Canada',
  'https://lh5.googleusercontent.com/p/AF1QipPxU38eYIJtE556UcRzqQpU0MBRuoHY9ywGa_Lh=w1360-h1020'
);
  return (
    <div>
      <ResturantCard restaurant={mcd}></ResturantCard>
      <ResturantCard restaurant={kfc}></ResturantCard>
    </div>
  );
}

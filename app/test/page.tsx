import RestaurantCard from "@/components/mycomponents/ResturantCard";
import { getAllRestaurants } from "@/actions/select";
import { log } from "console";
export default  async function  HomePage() {
 
  const restaurants = await getAllRestaurants();
  log(restaurants[0]);
  return (
    <div>
  
      {restaurants.map((restaurant) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </div>
  );
}
import RestaurantCard from "./restaurantCard";
import type { Restaurant } from "@/types/restaurant";
import { Link } from "react-router-dom";

interface Props {
  items: Restaurant[];
}

export default function RestaurantGrid({ items }: Props) {
  return (
    <div
      className="
        grid gap-4
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
      "
    >
      {items.map((r, i) => (
        <Link
          key={`${r.id}-${i}`}
          to={`/detail/${r.id}/${encodeURIComponent(r.name)}`}
          className="block cursor-pointer"
        >
          <RestaurantCard r={r} />
        </Link>
      ))}
    </div>
  );
}

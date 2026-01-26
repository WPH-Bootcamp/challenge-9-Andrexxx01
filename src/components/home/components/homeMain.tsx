import { useMemo, useState, useEffect } from "react";
import CategoryButtons from "./categoryButtons";
import RestaurantGrid from "./restaurantGrid";
import {
  useBestSellerRestaurants,
  useRecommendedRestaurants,
} from "@/services/queries/useRestaurants";
import { Button } from "@/components/ui/button";
import { useAllRestaurants } from "@/services/queries/useAllRestaurats";
import type { Category, Restaurant } from "@/types/restaurant";

function shuffle<T>(arr: T[]) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function mergeWithDistance(
  source: Restaurant[],
  all: Restaurant[],
): Restaurant[] {
  if (!all.length) return source;

  const map = new Map<number, number>();
  all.forEach((r) => {
    if (typeof r.distance === "number") {
      map.set(r.id, r.distance);
    }
  });

  return source.map((r) => ({
    ...r,
    distance: map.get(r.id),
  }));
}

function buildPool(data: Restaurant[], count: number) {
  if (!data.length) return [];
  const pool: Restaurant[] = [];
  while (pool.length < count) {
    pool.push(...shuffle(data));
  }
  return pool;
}

export default function HomeMain() {
  const [category, setCategory] = useState<Category>("recommended");
  const [visible, setVisible] = useState(5);
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const update = () => {
      let cols = 1;
      if (window.innerWidth >= 1024)
        cols = 3; // desktop
      else if (window.innerWidth >= 640) cols = 2; // tablet

      setColumns(cols);

      if (cols === 1) setVisible(5);
      if (cols === 2) setVisible(8);
      if (cols === 3) setVisible(12);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const rec = useRecommendedRestaurants();
  const best = useBestSellerRestaurants();
  const all = useAllRestaurants({
    location: "Jakarta",
    range: 1000,
    priceMin: 1,
    priceMax: 2000000,
    rating: 1,
    page: 1,
    limit: 12,
  });

  const source: Restaurant[] = category === "best" ? (best.data ?? []) : (rec.data ?? []);
 
  const mergedSource = useMemo(
    () => mergeWithDistance(source, all.data ?? []),
    [source, all.data],
  );

  const pool = useMemo(
    () => buildPool(mergedSource, Math.max(visible, 12)),
    [mergedSource, visible],
  );

  const shuffled = useMemo(() => shuffle(pool), [category, pool]);

  const data = shuffled.slice(0, visible);

  const titleMap: Record<Category, string> = {
    recommended: "Recommended",
    nearby: "Nearby",
    discount: "Discount",
    best: "Best Seller",
    delivery: "Delivery",
    lunch: "Lunch",
  };

  return (
    <main className="relative -mt-16 bg-white px-4 py-8 md:px-30">
      <CategoryButtons
        active={category}
        onChange={(v) => {
          setCategory(v);
          setVisible(5);
          if (columns === 1) setVisible(5);
          if (columns === 2) setVisible(8);
          if (columns === 3) setVisible(12);
        }}
      />

      <div className="mt-12 flex items-center justify-between">
        <h2 className="text-display-xs md:text-display-md font-extrabold text-neutral-950">
          {titleMap[category]}
        </h2>
        <span className="text-sm font-bold text-primary-100 cursor-pointer">
          See All
        </span>
      </div>

      <div
        className="mt-8 box-shadow: 0px 0px 20px 0px #CBCACA40"
      >
        <RestaurantGrid items={data} />
      </div>

      <div className="mt-6 flex justify-center hover:opacity-60">
        <Button
          variant="outline"
          className="rounded-full px-8 border border-neutral-300 cursor-pointer min-h-10 min-w-40 md:min-h-12 text-sm md:text-md font-bold"
          onClick={() => setVisible((v) => v + columns)}
        >
          Show More
        </Button>
      </div>
    </main>
  );
}

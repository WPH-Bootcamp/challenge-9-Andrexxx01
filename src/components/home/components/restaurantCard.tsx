import { Card } from "@/components/ui/card";
import type { Restaurant } from "@/types/restaurant";

interface Props {
  r: Restaurant;
  variant?: "grid" | "detail";
}

export default function RestaurantCard({ r, variant = "grid", }: Props) { const isDetail = variant === "detail"; 
  return (
    <Card
      className={
        isDetail
          ? "border-0 shadow-none bg-transparent rounded-none p-0 flex flex-row items-start gap-4"
          : "flex flex-row items-start gap-4 rounded-3xl p-4 shadow-sm"
      }
    >
     
      <div className="flex shrink-0 items-center justify-center">
        <img
          src={r.logo}
          alt={r.name}
          className="h-22.5 w-22.5 md:h-30 md:w-30 object-contain"
        />
      </div>

     
      <div className="flex flex-col gap-1 md:mt-4">
        <h3 className="text-md md:text-lg font-extrabold text-neutral-950">
          {r.name}
        </h3>

        <div className="flex items-center gap-1 text-sm md:text-md text-neutral-950">
          <img src="/Star.svg" className="h-6 w-6" />
          <span className="font-medium">{r.star}</span>
        </div>

        <p className="text-sm md:text-md text-neutral-950">
          {r.place}
          {r.distance !== undefined && (
            <span className="ml-1">· {r.distance.toFixed(1)} km</span>
          )}
        </p>
      </div>
    </Card>
  );
}
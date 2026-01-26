import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api/axios";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface Resto {
  id: number;
  name: string;
  star: number;
  place: string;
  logo: string;
  distance: number;
}

export default function CategoryPage() {
  const [openFilter, setOpenFilter] = useState(false);
  const [distance, setDistance] = useState<"nearby" | "1" | "3" | "5">(
    "nearby",
  );
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["all-resto", distance, minPrice, maxPrice, rating],
    queryFn: async () => {
      const { data } = await api.get("/api/resto", {
        params: {
          location: "Jakarta",
          range:
            distance === "nearby"
              ? 1000
              : distance === "1"
                ? 1000
                : distance === "3"
                  ? 3000
                  : 5000,
          priceMin: minPrice || undefined,
          priceMax: maxPrice || undefined,
          rating: rating || undefined,
          page: 1,
          limit: 12,
        },
      });

      return data.data.restaurants as Resto[];
    },
  });

  return (
    <>
      <Header forceScrolled />

      <main className="pt-24 min-h-screen bg-white px-4 md:px-30">
        <div className="py-10">
       
          <h1 className="mb-4 text-display-xs font-extrabold md:text-display-md">
            All Restaurant
          </h1>

          {/* Mobile filter row */}
          <div className="mb-8 flex items-center justify-between rounded-xl h-13 bg-white shadow-[0px_0px_20px_0px_#CBCACA40] md:hidden">
            <span className="text-sm font-extrabold p-3">FILTER</span>
            <button
              onClick={() => setOpenFilter(true)}
                className="p-3"
            >
              <img src="/filter-lines.svg" className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-[280px_1fr]">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block">
              <div className="mb-4 text-md font-extrabold">FILTER</div>
              <FilterPanel
                distance={distance}
                setDistance={setDistance}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                rating={rating}
                setRating={setRating}
              />
            </aside>

         
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="rounded-3xl p-5">
                      <CardContent className="space-y-4 p-0">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-12 w-12 rounded-xl" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                : data?.map((r) => (
                    <Card key={r.id} className="rounded-3xl p-5">
                      <CardContent className="p-0">
                        <div className="flex items-center gap-3">
                          <img
                            src={r.logo}
                            className="h-12 w-12 rounded-xl object-cover"
                          />
                          <div className="flex-1">
                            <div className="font-bold">{r.name}</div>
                            <div className="text-xs text-neutral-500">
                              ⭐ {r.star} • {r.place} - {r.distance.toFixed(1)}{" "}
                              km
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />

   
      {openFilter && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpenFilter(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[85%] max-w-sm bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm font-bold">FILTER</span>
              <button onClick={() => setOpenFilter(false)}>
                <img src="/Close.svg" className="h-6 w-6" />
              </button>
            </div>

            <FilterPanel
              distance={distance}
              setDistance={setDistance}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              rating={rating}
              setRating={setRating}
            />
          </div>
        </div>
      )}
    </>
  );
}

function FilterPanel({
  distance,
  setDistance,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  rating,
  setRating,
}: {
  distance: "nearby" | "1" | "3" | "5";
  setDistance: (v: "nearby" | "1" | "3" | "5") => void;
  minPrice: string;
  setMinPrice: (v: string) => void;
  maxPrice: string;
  setMaxPrice: (v: string) => void;
  rating: number | null;
  setRating: (v: number | null) => void;
}) {
  return (
    <div className="space-y-8">
      <div>
        <div className="mb-3 text-sm font-bold">Distance</div>
        <div className="space-y-3 text-sm">
          {[
            { k: "nearby", l: "Nearby" },
            { k: "1", l: "Within 1 km" },
            { k: "3", l: "Within 3 km" },
            { k: "5", l: "Within 5 km" },
          ].map((d) => (
            <label key={d.k} className="flex items-center gap-2">
              <Checkbox
                checked={distance === d.k}
                onCheckedChange={() => setDistance(d.k as any)}
              />
              {d.l}
            </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-neutral-200" />

      <div>
        <div className="mb-3 text-sm font-bold">Price</div>
        <div className="space-y-3">
          <div className="relative">
            <img
              src="/Currency Container.svg"
              className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2"
            />
            <Input
              className="pl-10"
              placeholder="Minimum Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>
          <div className="relative">
            <img
              src="/Currency Container.svg"
              className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2"
            />
            <Input
              className="pl-10"
              placeholder="Maximum Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="h-px bg-neutral-200" />

      <div>
        <div className="mb-3 text-sm font-bold">Rating</div>
        <div className="space-y-3 text-sm">
          {[5, 4, 3, 2, 1].map((n) => (
            <label key={n} className="flex items-center gap-2">
              <Checkbox
                checked={rating === n}
                onCheckedChange={() => setRating(rating === n ? null : n)}
              />
              ⭐ {n}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

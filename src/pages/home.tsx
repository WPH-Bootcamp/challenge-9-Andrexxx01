import Hero from "@/components/home/hero";
import HomeMain from "@/components/home/components/homeMain";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { useAppSelector } from "@/features/hooks";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api/axios";
import MenuSection from "@/components/detail/menuSection";
import RestaurantCard from "@/components/home/components/restaurantCard";

export default function HomePage() {

  const keyword = useAppSelector((s) => s.search.keyword);

  const { data, isLoading } = useQuery({
    queryKey: ["search", keyword],
    enabled: !!keyword,
    queryFn: async () => {
      const { data } = await api.get("/api/resto", {
        params: { search: keyword },
      });
      return data.data;
    },
  });

  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <div>
      
        {!keyword && <HomeMain />}

        {keyword && !isLoading && (
          <div className="grid gap-6">
            {data?.restaurants
              ?.filter((r: any) => r && r.logo)
              .map((r: any) => (
                <RestaurantCard key={r.id} r={r} />
              ))}

            {data?.menus?.map((m: any) => (
              <MenuSection key={m.id} {...m} />
            ))}

            {!data?.restaurants?.length && !data?.menus?.length && (
              <p className="text-center text-neutral-500">
                No result found for “{keyword}”
              </p>
            )}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}

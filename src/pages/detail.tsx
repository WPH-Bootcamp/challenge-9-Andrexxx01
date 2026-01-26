import { useParams } from "react-router-dom";
import { useState } from "react";
import { useRestaurantDetail } from "@/services/queries/useRestaurantDetail";
import RestaurantCard from "@/components/home/components/restaurantCard";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { useAllRestaurants } from "@/services/queries/useAllRestaurats";
import MenuSection from "@/components/detail/menuSection";
import ReviewSection from "@/components/detail/reviewSection";
import DetailCartBar from "@/components/detail/detailCartBar";

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useRestaurantDetail(Number(id));
  const [active, setActive] = useState(0);

  const all = useAllRestaurants({
    location: "Jakarta",
    range: 1000,
    priceMin: 1,
    priceMax: 2000000,
    rating: 1,
    page: 1,
    limit: 50,
  });

  if (isLoading || !data) {
    return <div className="min-h-screen bg-white" />;
  }

  const distance = all.data?.find((r) => r.id === data.id)?.distance;

  const images = data.images ?? [];
  const next = () => setActive((v) => (v + 1) % 3);

  return (
    <main className="min-h-screen bg-white">
      <Header forceScrolled />

      {/* Content */}
      <div className="pt-32 px-4 md:px-30">
  
        <div className="hidden md:grid grid-cols-2 gap-4">
          <div className="relative h-117.5 w-full overflow-hidden rounded-3xl">
            <img
              src={images[0]}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          <div className="grid grid-rows-2 gap-4">
            <div className="relative h-75.5 w-full overflow-hidden rounded-3xl">
              <img
                src={images[1]}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative h-37 w-full overflow-hidden rounded-3xl">
                <img
                  src={images[2]}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>

              <div className="relative h-37 w-full overflow-hidden rounded-3xl">
                <img
                  src={images[3]}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Slider */}
      <div className="md:hidden px-4 -mt-8">
        <div className="overflow-hidden rounded-3xl">
          <img src={images[active]} className="h-64 w-full object-cover" />
        </div>

        <button onClick={next} className="mt-3 flex w-full justify-center">
          <img
            src={
              active === 0
                ? "/left-pagination.svg"
                : active === 1
                  ? "/middle-pagination.svg"
                  : "/right-pagination.svg"
            }
            className="cursor-pointer"
          />
        </button>
      </div>

      {/* CARD */}
      <div className="mt-8 px-4 md:px-30 md:-mt-30 flex items-start gap-4">
        <div className="flex-1">
          <RestaurantCard r={{ ...data, distance }} variant="detail" />
        </div>

        <button className="mt-6 hidden md:flex items-center gap-2 rounded-full border px-4 py-2 text-md font-bold cursor-pointer hover:bg-neutral-600">
          <img src="/share.svg" className="h-4 w-4" />
          Share
        </button>

        <button className="mt-8 md:hidden border rounded-full h-11 w-11 flex items-center justify-center border-neutral-300 cursor-pointer hover:bg-neutral-600">
          <img src="/share.svg" className="h-5 w-5" />
        </button>
      </div>

      {/* Divider */}
      <div className="my-6 h-px mx-4 md:mx-30 bg-neutral-300" />

      <MenuSection
        menus={data.menus}
        restaurantId={data.id}
        restaurantName={data.name}
        restaurantLogo={data.logo}
      />
      <div className="my-10 h-px mx-4 md:mx-30 bg-neutral-300" />
      <ReviewSection
        averageRating={data.averageRating}
        totalReviews={data.totalReviews}
        reviews={data.reviews}
      />
      <DetailCartBar restaurantId={data.id} />
      {/* FOOTER */}
      <Footer />
    </main>
  );
}

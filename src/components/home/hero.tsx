import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/features/hooks";
import { setKeyword } from "@/features/search/searchSlice";

export default function Hero() {
  const dispatch = useAppDispatch();
  const keyword = useAppSelector((s) => s.search.keyword);

  return (
    <section
      className="
        relative h-162
        bg-[url('/Image.svg')]
        bg-cover bg-center
        text-neutral-25 px-4 lg:px-30 md:h-206.75
      "
    >
      {/* Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-black/60" />

      {/* Center Content */}
      <div className="relative flex h-full flex-col items-center justify-center text-center">
        <h1 className="text-display-lg font-extrabold md:text-display-2xl">
          Explore Culinary Experiences
        </h1>
        <p className="mt-3 text-lg font-bold md:text-display-xs">
          Search and refine your choice to discover the perfect restaurant.
        </p>

        <div className="mt-6 w-full max-w-xl">
          <div className="relative">
            {!keyword && (
              <img
                src="/Search.svg"
                alt="search"
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 opacity-70"
              />
            )}
            <Input
              value={keyword}
              onChange={(e) => dispatch(setKeyword(e.target.value))}
              placeholder="Search restaurants, food and drink"
              className="h-12 pl-11 rounded-full bg-white text-black! md:h-14 placeholder:text-neutral-600 placeholder:text-sm placeholder:md:text-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

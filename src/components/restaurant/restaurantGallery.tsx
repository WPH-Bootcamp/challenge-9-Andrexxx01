import { useState } from "react";

interface Props {
  images: string[];
}

export default function RestaurantGallery({ images }: Props) {
  const safe = images.slice(0, 4);
  const [active, setActive] = useState(0);

  return (
    <div className="w-full">
  
      <div className="lg:hidden">
        <div className="relative overflow-hidden rounded-3xl">
          <div
            className="flex transition-transform duration-300"
            style={{ transform: `translateX(-${active * 100}%)` }}
          >
            {safe.slice(0, 3).map((src, i) => (
              <img
                key={i}
                src={src}
                className="h-64 w-full shrink-0 object-cover"
              />
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-3 flex items-center justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="cursor-pointer"
            >
              <img
                src={
                  active === i
                    ? "/middle-pagination.svg"
                    : i === 0
                      ? "/left-pagination.svg"
                      : "/right-pagination.svg"
                }
                className="h-2"
              />
            </button>
          ))}
        </div>
      </div>

 
      <div className="hidden lg:grid grid-cols-2 gap-4">
        {/* Left big */}
        <div>
          <img
            src={safe[0]}
            className="h-full w-full rounded-3xl object-cover"
          />
        </div>

        {/* Right side */}
        <div className="grid grid-rows-2 gap-4">
   
          {safe[1] && (
            <img
              src={safe[1]}
              className="h-full w-full rounded-3xl object-cover"
            />
          )}

      
          <div className="grid grid-cols-2 gap-4">
            {safe[2] && (
              <img
                src={safe[2]}
                className="h-full w-full rounded-3xl object-cover"
              />
            )}
            {safe[3] && (
              <img
                src={safe[3]}
                className="h-full w-full rounded-3xl object-cover"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

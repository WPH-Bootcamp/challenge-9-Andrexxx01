import { useMemo, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

type Review = {
  id: number;
  star: number;
  comment: string | null;
  createdAt: string;
  user: {
    id: number;
    name: string;
    avatar: string | null;
  };
};

interface Props {
  averageRating: number;
  totalReviews: number;
  reviews: Review[];
}

export default function ReviewSection({
  averageRating,
  totalReviews,
  reviews,
}: Props) {
  const [visible, setVisible] = useState(6);
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1024) setColumns(2);
      else setColumns(1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const data = useMemo(() => reviews.slice(0, visible), [reviews, visible]);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <section className="mt-10 px-4 md:px-30">
      {/* Header */}
      <h3 className="text-display-xs md:text-display-lg font-extrabold text-neutral-950">
        Review
      </h3>

      <div className="mt-2 flex items-center gap-2 text-md md:text-xl font-extrabold text-neutral-950">
        <img src="/Star.svg" className="h-6 w-6 md:h-8.5 md:w-8.5" />
        {averageRating.toFixed(1)} ({totalReviews} Ulasan)
      </div>

      {/* Grid */}
      <div
        className="
          mt-6 grid gap-4
          grid-cols-1
          lg:grid-cols-2
        "
      >
        {data.map((r) => (
          <Card key={r.id} className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <img
                src={r.user.avatar || "/Ellipse 3.svg"}
                className="h-14.5 w-14.5 md:h-16 md:w-16 rounded-full object-cover"
              />

              <div className="flex flex-col">
                <span className="text-md md:text-lg font-extrabold text-neutral-950">
                  {r.user.name}
                </span>
                <span className="text-sm md:text-md text-neutral-950">
                  {formatDate(r.createdAt)}
                </span>
              </div>
            </div>

            {/* Stars */}
            <div className="mt-3 flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <img
                  key={i}
                  src="/Star.svg"
                  className={`h-6 w-6 ${
                    i < r.star ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
            </div>

            {/* Comment */}
            {r.comment && (
              <p className="mt-3 text-sm md:text-md leading-relaxed text-neutral-950">
                {r.comment}
              </p>
            )}
          </Card>
        ))}
      </div>

      {/* Show More */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => setVisible((v) => v + columns)}
          className="h-12 rounded-full border border-neutral-300 px-10 text-sm md:text-md font-bold cursor-pointer hover:bg-neutral-600"
        >
          Show More
        </button>
      </div>
    </section>
  );
}

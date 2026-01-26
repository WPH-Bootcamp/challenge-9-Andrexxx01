import { useNavigate } from "react-router-dom";
import type { Category } from "@/types/restaurant";

type ItemKey = Category | "all";

interface Props {
  active: Category;
  onChange: (v: Category) => void;
}

const items : { key: ItemKey; label: string; icon: string }[] = [
  { key: "all", label: "All Restaurant", icon: "/all-restaurant.svg" },
  { key: "nearby", label: "Nearby", icon: "/nearby.svg" },
  { key: "discount", label: "Discount", icon: "/discount.svg" },
  { key: "best", label: "Best Seller", icon: "/best-seller.svg" },
  { key: "delivery", label: "Delivery", icon: "/delivery.svg" },
  { key: "lunch", label: "Lunch", icon: "/lunch.svg" },
] as const;

export default function CategoryButtons({ active, onChange }: Props) {
  const navigate = useNavigate();

  return (
    <div
      className="
        grid grid-cols-3 gap-5
        md:flex md:justify-between md:w-full 
      "
    >
      {items.map((it) => {
        const isActive = it.key !== "all" && active === it.key;
        return (
          <button
            key={it.key}
            onClick={() => {
              if (it.key === "all") {
                navigate("/category");
              } else {
                onChange(it.key);
              }
            }}
            className="flex flex-col items-center gap-3 cursor-pointer"
          >
            {/* Icon Card */}
            <div
              className={`
          flex items-center justify-center
          rounded-3xl transition h-20 w-full md:h-22 lg:h-25 lg:min-w-30 xl:min-w-40
          box-shadow: 0px 0px 20px 0px #CBCACA40;
          ${isActive ? "bg-primary-100" : "bg-white"}
          shadow-sm hover:shadow-md
        `}
            >
              <img src={it.icon} className="h-12 w-12 md:h-16.25 md:w-16.25" />
            </div>

            {/* Label */}
            <span
              className={`
          text-sm md:text-lg font-bold
          ${isActive ? "text-primary-100" : "text-neutral-900"}
        `}
            >
              {it.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

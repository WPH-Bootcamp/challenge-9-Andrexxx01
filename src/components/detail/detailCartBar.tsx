import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/features/hooks";

interface Props {
  restaurantId: number;
}

export default function DetailCartBar({ restaurantId }: Props) {
  const navigate = useNavigate();
  const items = useAppSelector((s) => s.cart.items);

  const scoped = useMemo(
    () => items.filter((it) => it.restaurantId === restaurantId),
    [items, restaurantId],
  );

  const totalItem = useMemo(
    () => scoped.reduce((a, b) => a + b.quantity, 0),
    [scoped],
  );

  const totalPrice = useMemo(
    () => scoped.reduce((a, b) => a + b.quantity * b.price, 0),
    [scoped],
  );

  if (scoped.length === 0) return null;

  return (
    <div
      className="
        fixed bottom-0 left-0 right-0 z-40
        border-t bg-white
        px-4 py-3 md:px-30
        shadow-[0_-4px_20px_rgba(0,0,0,0.08)]
      "
    >
      <div className="flex items-center justify-between">
        {/* Left */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <img src="/Bag-fill-black.svg" className="h-5 w-5 md:h-6 md:w-6" />
            <p className="text-sm md:text-md text-neutral-950">
              {totalItem} Items
            </p>
          </div>

          <p className="text-md md:text-xl font-extrabold text-neutral-950">
            Rp{totalPrice.toLocaleString("id-ID")}
          </p>
        </div>

        {/* Right */}
        <button
          onClick={() => navigate(`/checkout?restaurantId=${restaurantId}`)}
          className="
            rounded-full bg-red-600
            px-6 py-2
            text-sm md:text-md font-bold text-white
            hover:bg-red-700 cursor-pointer w-40 md:w-57.5
          "
        >
          Checkout
        </button>
      </div>
    </div>
  );
}

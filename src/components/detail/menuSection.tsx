import { useMemo, useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useCartMutations } from "@/services/queries/useCartMutations";
import { useAppSelector } from "@/features/hooks";


type MenuItem = {
  id: number;
  foodName: string;
  price: number;
  type: "food" | "drink";
  image: string;
};

type Filter = "all" | "food" | "drink";

interface Props {
  menus: MenuItem[];
  restaurantId: number;
  restaurantName: string;
  restaurantLogo: string;
}

export default function MenuSection({
  menus,
  restaurantId,
  restaurantName,
  restaurantLogo,
}: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const [visible, setVisible] = useState(8);
  const [columns, setColumns] = useState(2);
  
  const { addMutation, updateMutation, removeMutation } = useCartMutations();
  const cart = useAppSelector((s) => s.cart.items);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1024) setColumns(4);
      else if (window.innerWidth >= 768) setColumns(3);
      else setColumns(2);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return menus;
    return menus.filter((m) => m.type === filter);
  }, [menus, filter]);

  const data = filtered.slice(0, visible);

  const findCartItem = (menuId: number) =>
    cart.find((c) => c.restaurantId === restaurantId && c.menuId === menuId);

  const getQty = (menuId: number) => findCartItem(menuId)?.quantity ?? 0;

  const onAdd = (m: MenuItem) => {
    addMutation.mutate({
      restaurantId,
      restaurantName,
      restaurantLogo,
      menuId: m.id,
      foodName: m.foodName,
      price: m.price,
      image: m.image,
      quantity: 1,
    });
  };

  const onInc = (m: MenuItem) => {
    const item = findCartItem(m.id);
    if (!item || !item.cartItemId) return;

    updateMutation.mutate({
      cartItemId: item.cartItemId,
      quantity: item.quantity + 1,
    });
  };

  const onDec = (m: MenuItem) => {
    const item = findCartItem(m.id);
    if (!item || !item.cartItemId) return;

    const next = item.quantity - 1;

    if (next <= 0) {
      removeMutation.mutate(item.cartItemId);
    } else {
      updateMutation.mutate({
        cartItemId: item.cartItemId,
        quantity: next,
      });
    }
  };

  return (
    <section className="mt-10 px-4 md:px-30">
      <h3 className="text-display-xs md:text-display-lg font-extrabold text-neutral-950">
        Menu
      </h3>

      <div className="mt-4 flex gap-3">
        {[
          { k: "all", label: "All Menu" },
          { k: "food", label: "Food" },
          { k: "drink", label: "Drink" },
        ].map((it) => (
          <button
            key={it.k}
            onClick={() => {
              setFilter(it.k as Filter);
              setVisible(8);
            }}
            className={`
              rounded-full px-4 py-2 text-sm md:text-md font-bold cursor-pointer
              ${
                filter === it.k
                  ? "border border-red-500 text-red-500 bg-red-50"
                  : "border border-neutral-200 text-neutral-700"
              }
            `}
          >
            {it.label}
          </button>
        ))}
      </div>

      <div
        className="
          mt-6 grid gap-4
          grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
        "
      >
        {data.map((m) => {
          const q = getQty(m.id);

          return (
            <Card
              key={m.id}
              className="overflow-hidden h-76.5 md:h-94.75 rounded-2xl bg-white shadow-sm"
            >
              <div className="relative h-43 md:h-71.25 w-full overflow-hidden">
                <img
                  src={m.image}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>

              <div className="p-3">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm md:text-md font-medium text-neutral-950">
                      {m.foodName}
                    </p>
                    <p className="mt-1 text-md md:text-lg font-extrabold text-neutral-950">
                      Rp{m.price.toLocaleString("id-ID")}
                    </p>
                  </div>

                  <div className="w-full md:w-28 shrink-0">
                    {q === 0 ? (
                      <button
                        onClick={() => onAdd(m)}
                        className="w-full rounded-full bg-red-600 px-6 py-2 text-sm md:text-md font-bold text-white cursor-pointer hover:bg-red-800"
                      >
                        Add
                      </button>
                    ) : (
                      <div className="flex items-center justify-between md:justify-center gap-4">
                        <button onClick={() => onDec(m)}>
                          <img src="/minus.svg" className="h-9 w-9 cursor-pointer" />
                        </button>

                        <span className="text-md font-semibold">{q}</span>

                        <button onClick={() => onInc(m)}>
                          <img src="/plus.svg" className="h-9 w-9 cursor-pointer" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

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

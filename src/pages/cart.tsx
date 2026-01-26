import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { useAppSelector } from "@/features/hooks";
import { useCartMutations } from "@/services/queries/useCartMutations";
import { useNavigate } from "react-router-dom";


export default function CartPage() {
  const navigate = useNavigate();
  const items = useAppSelector((s) => s.cart.items);
  const { updateMutation, removeMutation } = useCartMutations();

  const toSlug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

  
  const groups = items.reduce<Record<number, typeof items>>((acc, it) => {
    if (!acc[it.restaurantId]) acc[it.restaurantId] = [];
    acc[it.restaurantId].push(it);
    return acc;
  }, {});
  
  return (
    <>
      <Header forceScrolled />

      <main className="min-h-screen bg-white pt-24 px-4 md:px-30">
        <h1 className="mb-10 text-center text-display-xs font-extrabold">
          My Cart
        </h1>

        <div className="space-y-6 max-w-4xl mx-auto">
          {Object.entries(groups).map(([rid, items]) => {
            const total = items.reduce((a, b) => a + b.price * b.quantity, 0);

            return (
              <div
                key={rid}
                className="rounded-3xl bg-white p-5 md:p-8 shadow-[0px_0px_20px_0px_#CBCACA40]"
              >
                {/* Restaurant header */}
                <div
                  className="mb-4 flex items-center cursor-pointer"
                  onClick={() =>
                    navigate(
                      `/detail/${items[0].restaurantId}/${toSlug(
                        items[0].restaurantName,
                      )}`,
                    )
                  }
                >
                  <div className="flex items-center gap-2 font-bold">
                    <img src="/Rectangle.svg" className="h-5 w-5" />
                    {items[0].restaurantName}
                  </div>
                  <img src="/chevron-down.svg" className="h-4 w-4" />
                </div>

                {/* Items */}
                <div className="space-y-4">
                  {items.map((it) => (
                    <div
                      key={it.menuId}
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={it.image}
                          className="h-14 w-14 rounded-xl object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium">{it.foodName}</p>
                          <p className="text-sm font-bold">
                            Rp{it.price.toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const next = it.quantity - 1;
                            if (next <= 0) {
                              if (it.cartItemId)
                                removeMutation.mutate(it.cartItemId);
                            } else {
                              if (it.cartItemId)
                                updateMutation.mutate({
                                  cartItemId: it.cartItemId,
                                  quantity: next,
                                });
                            }
                          }}
                          className="h-8 w-8 rounded-full border flex items-center justify-center"
                        >
                          –
                        </button>
                        <span className="w-4 text-center text-sm font-medium">
                          {it.quantity}
                        </span>
                        <button
                          onClick={() => {
                            if (it.cartItemId)
                              updateMutation.mutate({
                                cartItemId: it.cartItemId,
                                quantity: it.quantity + 1,
                              });
                          }}
                          className="h-8 w-8 rounded-full bg-red-600 text-white flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="my-6 border-t border-dashed" />

                {/* Footer area */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm text-neutral-500">Total</p>
                    <p className="text-lg font-extrabold">
                      Rp{total.toLocaleString("id-ID")}
                    </p>
                  </div>

                  <button
                    className="h-12 w-full md:w-48 rounded-full bg-red-600 text-white font-bold"
                    onClick={() =>
                      navigate(
                        `/checkout?restaurantId=${items[0].restaurantId}`,
                      )
                    }
                  >
                    Checkout
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </>
  );
}

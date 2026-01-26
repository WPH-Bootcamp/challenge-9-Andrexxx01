import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { api } from "@/services/api/axios";
import OrdersSidebar from "@/components/order/orderSidebar";
import ReviewModal from "@/components/order/reviewModal";

type OrderStatus =
  | "preparing"
  | "on_the_way"
  | "delivered"
  | "done"
  | "canceled";

export default function MyOrdersPage() {
  const [status, setStatus] = useState<OrderStatus>("done");
  const [search, setSearch] = useState("");
  const [activeReview, setActiveReview] = useState<{
    transactionId: string;
    restaurantId: number;
    menuIds: number[];
  } | null>(null);

  const [reviewedMap, setReviewedMap] = useState<Record<string, boolean>>({});

  const { data, isLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: async () => {
      const res = await api.get("/api/order/my-order");
      return res.data?.data?.orders ?? [];
    },
  });

  const filtered = useMemo(() => {
    return (data ?? [])
      .filter((o: any) => o.status === status)
      .filter((o: any) =>
        o.restaurants.some((r: any) =>
          r.restaurant.name.toLowerCase().includes(search.toLowerCase()),
        ),
      );
  }, [data, status, search]);

  return (
    <>
      <Header forceScrolled />

      <main className="pt-24 min-h-screen bg-white px-4 md:px-30">
        <div className="grid gap-6 md:grid-cols-[260px_1fr]">
          <OrdersSidebar />

          <section className="space-y-6">
            <h1 className="text-display-xs font-extrabold">My Orders</h1>

            <div className="relative">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className="w-full rounded-full border px-10 py-2 text-sm"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                🔍
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="mr-2 font-semibold">Status</span>
              {[
                ["preparing", "Preparing"],
                ["on_the_way", "On the Way"],
                ["delivered", "Delivered"],
                ["done", "Done"],
                ["canceled", "Canceled"],
              ].map(([k, label]) => (
                <button
                  key={k}
                  onClick={() => setStatus(k as OrderStatus)}
                  className={`rounded-full border px-4 py-1 ${
                    status === k
                      ? "border-red-500 text-red-600"
                      : "border-neutral-200 text-neutral-600"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="space-y-6">
              {isLoading && <p>Loading...</p>}

              {filtered.map((o: any) =>
                o.restaurants.map((r: any) => {
                  const key = `${o.transactionId}-${r.restaurant.id}`;
                  const reviewed = reviewedMap[key];

                  return (
                    <div
                      key={key}
                      className="rounded-3xl bg-white p-5 shadow-[0px_0px_20px_0px_#CBCACA40]"
                    >
                      <div className="mb-4 flex items-center gap-2 font-bold">
                        <img
                          src={r.restaurant.logo}
                          className="h-6 w-6 rounded"
                        />
                        {r.restaurant.name}
                      </div>

                      {r.items.map((it: any) => (
                        <div
                          key={it.menuId}
                          className="mb-3 flex items-center gap-3"
                        >
                          <img
                            src={it.image}
                            className="h-14 w-14 rounded-xl object-cover"
                          />
                          <div>
                            <p className="text-sm">{it.menuName}</p>
                            <p className="text-sm font-bold">
                              {it.quantity} x Rp
                              {it.price.toLocaleString("id-ID")}
                            </p>
                          </div>
                        </div>
                      ))}

                      <div className="mt-4 flex items-center justify-between border-t pt-4">
                        <div>
                          <p className="text-sm text-neutral-500">Total</p>
                          <p className="font-bold">
                            Rp{r.subtotal.toLocaleString("id-ID")}
                          </p>
                        </div>

                        <button
                          className="h-10 rounded-full bg-red-600 px-6 text-sm font-bold text-white disabled:opacity-60"
                          disabled={reviewed}
                          onClick={() =>
                            setActiveReview({
                              transactionId: o.transactionId,
                              restaurantId: r.restaurant.id,
                              menuIds: r.items.map(
                                (i: { menuId: number }) => i.menuId,
                              ),
                            })
                          }
                        >
                          {reviewed ? "Reviewed" : "Give Review"}
                        </button>
                      </div>
                    </div>
                  );
                }),
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />

      {activeReview && (
        <ReviewModal
          open={true}
          transactionId={activeReview.transactionId}
          restaurantId={activeReview.restaurantId}
          menuIds={activeReview.menuIds}
          onClose={() => setActiveReview(null)}
          onSuccess={() => {
            const key = `${activeReview.transactionId}-${activeReview.restaurantId}`;
            setReviewedMap((prev) => ({ ...prev, [key]: true }));
          }}
        />
      )}
    </>
  );
}

import { useState } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { useAppSelector } from "@/features/hooks";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCartMutations } from "@/services/queries/useCartMutations";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api/axios";
import PaymentSuccessToast from "@/components/checkout/paymentSuccessToast";


export default function CheckoutPage() {
  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await api.get("/api/auth/profile");
      return res.data?.data;
    },
  });

  const handleBuy = async () => {
    if (!profileQuery.data?.phone) return;

    const payload = {
      restaurants: [
        {
          restaurantId: items[0].restaurantId,
          items: items.map((it) => ({
            menuId: it.menuId,
            quantity: it.quantity,
          })),
        },
      ],
      deliveryAddress: "Jl. Sudirman No. 25, Jakarta Pusat, 10220",
      phone: profileQuery.data.phone,
      paymentMethod: paymentMethodLabel,
      notes: "Please ring the doorbell",
    };

    try {
      await api.post("/api/order/checkout", payload);
    } catch (e) {
  
      console.error("Checkout failed, but continuing optimistically", e);
    }

  
    items.forEach((it) => {
      if (it.cartItemId) removeMutation.mutate(it.cartItemId);
    });

    setSuccessData({
      date: new Date().toLocaleString("id-ID"),
      paymentMethod: paymentMethodLabel,
      price,
      items: totalItem,
      deliveryFee,
      serviceFee,
      total,
    });

    setShowSuccess(true);
  };


  const [paymentMethod, setPaymentMethod] = useState<
    "BNI" | "BRI" | "BCA" | "MANDIRI"
  >("BNI");
``
  const paymentMethodLabel =
    paymentMethod === "BNI"
      ? "BNI Bank Negara Indonesia"
      : paymentMethod === "BRI"
        ? "BRI Bank Rakyat Indonesia"
        : paymentMethod === "BCA"
          ? "BCA Bank Central Asia"
          : "Mandiri";

  const navigate = useNavigate();
  const { updateMutation, removeMutation } = useCartMutations();
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [params] = useSearchParams();
  const restaurantId = Number(params.get("restaurantId"));
  const allItems = useAppSelector((s) => s.cart.items);

  const items = allItems.filter((it) => it.restaurantId === restaurantId);

  if (!items.length && !showSuccess) {
    return (
      <>
        <Header forceScrolled />
        <main className="pt-24 px-4 md:px-30">
          <p className="text-center text-neutral-500">
            Cart for this restaurant is empty.
          </p>
        </main>
        <Footer />
      </>
    );
  } 

  const totalItem = items.reduce((a, b) => a + b.quantity, 0);
  const price = items.reduce((a, b) => a + b.price * b.quantity, 0);
  const deliveryFee = 10000;
  const serviceFee = 1000;
  const total = price + deliveryFee + serviceFee;

  return (
    <>
      <Header forceScrolled />

      <main className="pt-24 min-h-screen bg-white px-4 md:px-30">
        <h1 className="mb-8 text-display-xs font-extrabold">Checkout</h1>

        <div className="grid gap-6 md:grid-cols-[1fr_420px]">
          {/* LEFT */}
          <div className="space-y-6">
          
            <div className="rounded-3xl bg-white p-5 shadow-[0px_0px_20px_0px_#CBCACA40]">
              <div className="mb-2 flex items-center gap-2 font-bold">
                <img src="/location-mark.svg" className="h-5 w-5" />
                Delivery Address
              </div>
              <p className="text-sm text-neutral-700">
                Jl. Sudirman No. 25, Jakarta Pusat, 10220
              </p>
              <p className="text-sm text-neutral-700">
                {profileQuery.data?.phone ?? "-"}
              </p>

              <button className="mt-4 h-9 rounded-full border px-6 text-sm font-semibold">
                Change
              </button>
            </div>

            {/* Cart Items */}
            <div className="rounded-3xl bg-white p-5 shadow-[0px_0px_20px_0px_#CBCACA40]">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold">
                  <img src="/Rectangle.svg" className="h-5 w-5" />
                  Burger King
                </div>
                <button
                  className="h-9 rounded-full border px-4 text-sm font-semibold"
                  onClick={() =>
                    navigate(
                      `/detail/${items[0].restaurantId}/${items[0].restaurantName
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`,
                    )
                  }
                >
                  Add item
                </button>
              </div>

              <div className="space-y-4">
                {items.map((it) => (
                  <div
                    key={it.menuId}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={it.image}
                        className="h-14 w-14 rounded-xl object-cover"
                      />
                      <div>
                        <p className="text-sm">{it.foodName}</p>
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
                            if (it.cartItemId) {
                              removeMutation.mutate(it.cartItemId);
                            }
                          } else {
                            if (it.cartItemId) {
                              updateMutation.mutate({
                                cartItemId: it.cartItemId,
                                quantity: next,
                              });
                            }
                          }
                        }}
                        className="h-8 w-8 rounded-full border flex items-center justify-center"
                      >
                        –
                      </button>
                      <span className="w-4 text-center text-sm">
                        {it.quantity}
                      </span>
                      <button
                        onClick={() => {
                          if (it.cartItemId) {
                            updateMutation.mutate({
                              cartItemId: it.cartItemId,
                              quantity: it.quantity + 1,
                            });
                          }
                        }}
                        className="h-8 w-8 rounded-full bg-red-600 text-white flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
           
            <div className="rounded-3xl bg-white p-5 shadow-[0px_0px_20px_0px_#CBCACA40]">
              <div className="mb-4 font-bold">Payment Method</div>

              {[
                {
                  key: "BNI",
                  name: "BNI Bank Negara Indonesia",
                  logo: "/bank-bni.svg",
                },
                {
                  key: "BRI",
                  name: "BRI Bank Rakyat Indonesia",
                  logo: "/bank-bri.svg",
                },
                {
                  key: "BCA",
                  name: "BCA Bank Central Asia",
                  logo: "/bank-bca.svg",
                },
                { key: "MANDIRI", name: "Mandiri", logo: "/bank-mandiri.svg" },
              ].map((b) => (
                <label
                  key={b.key}
                  className="flex items-center justify-between py-3 cursor-pointer"
                  onClick={() => setPaymentMethod(b.key as any)}
                >
                  <div className="flex items-center gap-3">
                    <img src={b.logo} className="h-6 w-6" />
                    <span className="text-sm">{b.name}</span>
                  </div>
                  <span
                    className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                      paymentMethod === b.key
                        ? "border-red-600"
                        : "border-neutral-300"
                    }`}
                  >
                    {paymentMethod === b.key && (
                      <span className="h-2 w-2 rounded-full bg-red-600" />
                    )}
                  </span>
                </label>
              ))}
            </div>

         
            <div className="rounded-3xl bg-white p-5 shadow-[0px_0px_20px_0px_#CBCACA40]">
              <div className="mb-4 font-bold">Payment Summary</div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Price ({totalItem} items)</span>
                  <span>Rp{price.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>Rp{deliveryFee.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Fee</span>
                  <span>Rp{serviceFee.toLocaleString("id-ID")}</span>
                </div>

                <div className="mt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span>Rp{total.toLocaleString("id-ID")}</span>
                </div>
              </div>

              <button
                className="mt-6 h-12 w-full rounded-full bg-red-600 text-white font-bold"
                onClick={handleBuy}
              >
                Buy
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <PaymentSuccessToast
        open={showSuccess}
        onOpenChange={setShowSuccess}
        data={
          successData ?? {
            date: "",
            paymentMethod: "",
            price: 0,
            items: 0,
            deliveryFee: 0,
            serviceFee: 0,
            total: 0,
          }
        }
      />
    </>
  );
}

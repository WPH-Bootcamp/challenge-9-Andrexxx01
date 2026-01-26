// src/pages/profile/index.tsx
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import OrdersSidebar from "@/components/order/orderSidebar";
import { api } from "@/services/api/axios";

export default function ProfilePage() {
  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await api.get("/api/auth/profile");
      return res.data?.data;
    },
  });

  return (
    <>
      <Header forceScrolled />

      <main className="pt-24 min-h-screen bg-white px-4 md:px-30">
        <div className="grid gap-6 md:grid-cols-[260px_1fr]">
          {/* Sidebar (Desktop) */}
          <OrdersSidebar />

          {/* Content */}
          <section className="space-y-6">
            <h1 className="text-display-xs font-extrabold">Profile</h1>

            <div className="max-w-xl rounded-3xl bg-white p-6 shadow-[0px_0px_20px_0px_#CBCACA40]">
              {isLoading ? (
                <div className="space-y-4">
                  <div className="h-16 w-16 rounded-full bg-neutral-200" />
                  <div className="h-4 w-40 bg-neutral-200 rounded" />
                  <div className="h-4 w-56 bg-neutral-200 rounded" />
                  <div className="h-4 w-48 bg-neutral-200 rounded" />
                </div>
              ) : (
                <>
                  <div className="mb-6 flex items-center gap-4">
                    <img
                      src={data?.avatar || "/Ellipse 3.svg"}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  </div>

                  <div className="grid grid-cols-[160px_1fr] gap-y-3 text-sm">
                    <div className="text-neutral-500">Name</div>
                    <div className="font-semibold text-neutral-950">
                      {data?.name || "-"}
                    </div>

                    <div className="text-neutral-500">Email</div>
                    <div className="font-semibold text-neutral-950">
                      {data?.email || "-"}
                    </div>

                    <div className="text-neutral-500">Nomor Handphone</div>
                    <div className="font-semibold text-neutral-950">
                      {data?.phone || "-"}
                    </div>
                  </div>

                  <button
                    className="mt-6 h-12 w-full rounded-full bg-red-600 text-sm font-bold text-white hover:bg-red-700"
                    onClick={() => {
                    
                    }}
                  >
                    Update Profile
                  </button>
                </>
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

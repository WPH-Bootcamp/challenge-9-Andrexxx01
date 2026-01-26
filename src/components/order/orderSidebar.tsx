// components/orders/OrdersSidebar.tsx
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/features/hooks";
import { logout } from "@/features/auth/authSlice";
import { persistor } from "@/features/store";

export default function OrdersSidebar() {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = async () => {
    dispatch(logout());
    await persistor.purge();
    navigate("/");
  };

  return (
    <aside
      className="
        hidden md:block
        w-65
        rounded-3xl bg-white
        shadow-[0px_0px_20px_0px_#CBCACA40]
        overflow-hidden
        h-fit
      "
    >
     
      <div className="flex items-center gap-3 p-4">
        <img
          src={user.avatar || "/Ellipse 3.svg"}
          alt={user.name ?? "User"}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="text-md font-bold text-neutral-950">{user.name}</div>
      </div>

      <div className="h-px bg-neutral-200" />

   
      <button
        type="button"
        className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-neutral-100 cursor-pointer"
      >
        <img src="/marker-pin-01.svg" className="h-5 w-5" />
        Delivery Address
      </button>

      <button
        type="button"
        className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-neutral-100 cursor-pointer"
      >
        <img src="/file-05.svg" className="h-5 w-5" />
        My Orders
      </button>

      <button
        type="button"
        onClick={handleLogout}
        className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-neutral-100 cursor-pointer"
      >
        <img src="/arrow-circle-broken-left.svg" className="h-5 w-5" />
        Logout
      </button>
    </aside>
  );
}

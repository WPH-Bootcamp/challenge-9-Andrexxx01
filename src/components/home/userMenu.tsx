import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/features/hooks";
import { logout } from "@/features/auth/authSlice";
import { persistor } from "@/features/store";
import type { User } from "@/types/auth";

interface Props {
  user: User;
}

export default function UserMenu({ user }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // close when click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    dispatch(logout());
    await persistor.purge();
    navigate("/");
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2"
      >
        <img
          src={user.avatar || "/Ellipse 3.svg"}
          alt={user.name ?? "User"}
          className="h-10 w-10 rounded-full object-cover md:h-12 md:w-12 cursor-pointer"
        />
        <span className="hidden md:block text-lg font-semibold">
          {user.name}
        </span>
      </button>

      {/* Popup */}
      {open && (
        <div
          className="
            absolute right-0 mt-3 w-56 rounded-2xl bg-white text-black
            shadow-xl overflow-hidden
          "
        >
          {/* Header */}
          <div className="flex items-center gap-3 p-4">
            <img
              src={user.avatar || "/Ellipse 3.svg"}
              alt={user.name}
              className="h-9 w-9 rounded-full object-cover"
            />
            <div className="text-md font-bold text-neutral-950">
              {user.name}
            </div>
          </div>

          <div className="h-px bg-neutral-200" />

          {/* Items */}
          <button
            type="button"
            className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-neutral-100 cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            <img src="/marker-pin-01.svg" className="h-5 w-5" />
            Delivery Address
          </button>

          <button
            type="button"
            className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-neutral-100 cursor-pointer"
            onClick={() => navigate("/orders")}
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
        </div>
      )}
    </div>
  );
}

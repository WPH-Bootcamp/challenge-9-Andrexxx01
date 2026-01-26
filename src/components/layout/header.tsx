import { useEffect, useState, useMemo } from "react";
import { useAppSelector } from "@/features/hooks";
import UserMenu from "@/components/home/userMenu";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  forceScrolled?: boolean;
}

export default function Header({ forceScrolled = false }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const user = useAppSelector((s) => s.auth.user);
  const cartItems = useAppSelector((s) => s.cart.items);
  const navigate = useNavigate();

  const restaurantCount = useMemo(() => {
    const set = new Set(cartItems.map((it) => it.restaurantId));
    return set.size;
  }, [cartItems]);

  useEffect(() => {
    if (forceScrolled) {
      setScrolled(true);
      return;
    }

    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll);
    onScroll(); 
    return () => window.removeEventListener("scroll", onScroll);
  }, [forceScrolled]);

  const guestBtnBase =
    "h-12 rounded-full md:min-w-40.75 p-2 text-sm md:text-md font-bold transition cursor-pointer";

  const signInClass = scrolled
    ? "border-2 border-neutral-950 text-neutral-950 hover:bg-neutral-800 hover:text-white"
    : "border-2 border-neutral-300 text-white hover:bg-white hover:text-neutral-950";

  const signUpClass = scrolled
    ? "bg-neutral-950 text-white hover:bg-neutral-500"
    : "bg-white text-neutral-950 hover:bg-neutral-800 hover:text-white";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 lg:px-30 py-4 transition-all ${
        scrolled
          ? "bg-white text-neutral-950 shadow-sm"
          : "bg-transparent text-neutral-25"
      }`}
    >
      <div className="flex items-center gap-2">
        <img
          src={scrolled ? "/Clip path group.svg" : "/Logo.svg"}
          alt="Foody"
          className="h-10 w-10 md:h-10.5 md:w-10.5"
        />
        <span
          className={`hidden md:block text-display-md font-extrabold ${
            scrolled ? "text-neutral-950" : "text-neutral-25"
          }`}
        >
          Foody
        </span>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        {user ? (
          <>
            <button className="relative" onClick={() => navigate("/cart")}>
              <img
                src={scrolled ? "/Bag-fill-black.svg" : "/Bag.svg"}
                alt="Cart"
                className="h-7 w-7 md:h-8 md:w-8"
              />
              {restaurantCount > 0 && (
                <span
                  className="
                    absolute -top-2 -right-2
                    h-5 min-w-5
                    rounded-full bg-red-600
                    px-1
                    flex items-center justify-center
                    text-xs font-bold text-white
                  "
                >
                  {restaurantCount}
                </span>
              )}
            </button>
            <UserMenu user={user} />
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/sign-in")}
              className={`${guestBtnBase} ${signInClass}`}
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/sign-up")}
              className={`${guestBtnBase} ${signUpClass}`}
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </header>
  );
}

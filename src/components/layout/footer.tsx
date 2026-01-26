import { useNavigate } from "react-router-dom";

type Cat =
  | "recommended"
  | "nearby"
  | "discount"
  | "best"
  | "delivery"
  | "lunch";

export default function Footer() {
  const navigate = useNavigate();

  const go = (cat?: Cat) => {
    if (!cat) {
      navigate("/");
    } else {
      navigate("/", { state: { category: cat } });
    }
  };

  return (
    <footer className="mt-24 bg-linear-to-b from-[#0E0F12] to-[#050506] text-white">
      <div className="px-4 py-16 md:px-30">
        <div className="grid gap-12 md:grid-cols-3 md:gap-20">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <img src="/Clip path group.svg" className="h-10.5 w-10.5" />
              <span className="text-display-md font-extrabold">Foody</span>
            </div>

            <p className="mt-4 max-w-sm text-sm md:text-md leading-relaxed text-neutral-25">
              Enjoy homemade flavors & chef’s signature dishes, freshly prepared
              every day. Order online or visit our nearest branch.
            </p>

            <div className="mt-8">
              <p className="mb-3 text-sm font-bold md:text-md md:font-extrabold text-neutral-25">
                Follow on Social Media
              </p>
              <div className="flex gap-3">
                <img src="/facebook.svg" className="h-10 w-10 cursor-pointer" />
                <img
                  src="/instagram.svg"
                  className="h-10 w-10 cursor-pointer"
                />
                <img src="/linkedin.svg" className="h-10 w-10 cursor-pointer" />
                <img src="/tiktok.svg" className="h-10 w-10 cursor-pointer" />
              </div>
            </div>
          </div>

          {/* Explore */}
          <div className="grid grid-cols-2 gap-12 md:col-span-2 md:grid-cols-2">
            <div>
              <h4 className="mb-4 text-sm md:text-md font-extrabold uppercase tracking-wide text-neutral-25">
                Explore
              </h4>
              <ul className="space-y-3 text-sm md:text-md text-neutral-25">
                <li
                  className="cursor-pointer hover:text-red-500"
                  onClick={() => go()}
                >
                  All Food
                </li>
                <li
                  className="cursor-pointer hover:text-red-500"
                  onClick={() => go("nearby")}
                >
                  Nearby
                </li>
                <li
                  className="cursor-pointer hover:text-red-500"
                  onClick={() => go("discount")}
                >
                  Discount
                </li>
                <li
                  className="cursor-pointer hover:text-red-500"
                  onClick={() => go("best")}
                >
                  Best Seller
                </li>
                <li
                  className="cursor-pointer hover:text-red-500"
                  onClick={() => go("delivery")}
                >
                  Delivery
                </li>
                <li
                  className="cursor-pointer hover:text-red-500"
                  onClick={() => go("lunch")}
                >
                  Lunch
                </li>
              </ul>
            </div>
            {/* Help */}
            <div>
              <h4 className="mb-4 text-sm md:text-md font-extrabold uppercase tracking-wide text-neutral-25">
                Help
              </h4>
              <ul className="space-y-3 text-sm md:text-md text-neutral-25">
                <li className="cursor-pointer hover:text-red-500">
                  How to Order
                </li>
                <li className="cursor-pointer hover:text-red-500">
                  Payment Methods
                </li>
                <li
                  className="cursor-pointer hover:text-red-500"
                  onClick={() => navigate("/orders")}
                >
                  {" "}
                  Track My Order
                </li>
                <li className="cursor-pointer hover:text-red-500">FAQ</li>
                <li className="cursor-pointer hover:text-red-500">
                  Contact Us
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

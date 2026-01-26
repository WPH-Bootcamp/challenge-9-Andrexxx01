import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";
import { useAppDispatch, useAppSelector } from "@/features/hooks";
import { setAll } from "@/store/cartSlice";
import type { CartItem } from "@/types/cart";

export function useCartSync() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

  const cartQuery = useQuery<CartItem[]>({
    queryKey: ["cart", isAuthenticated],
    enabled: isAuthenticated,
    queryFn: async () => {
      const res = await api.get(
        "https://restaurant-be-400174736012.asia-southeast2.run.app/api/cart",
      );
      const cart = res.data?.data?.cart ?? [];
      return cart.flatMap((group: any) =>
        group.items.map((it: any) => ({
          cartItemId: it.id,
          restaurantId: group.restaurant.id,
          restaurantName: group.restaurant.name,
          restaurantLogo: group.restaurant.logo,
          menuId: it.menu.id,
          foodName: it.menu.foodName,
          price: it.menu.price,
          image: it.menu.image,
          quantity: it.quantity,
        })),
      );
    },
    retry: false,
    refetchOnMount: "always",
  });

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!cartQuery.data) return;

    dispatch(setAll(cartQuery.data));
  }, [cartQuery.data, isAuthenticated, dispatch]);

  return cartQuery;
}

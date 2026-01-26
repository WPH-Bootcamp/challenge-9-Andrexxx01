import { useMutation } from "@tanstack/react-query";
import { api } from "../api/axios";
import { useAppDispatch, useAppSelector } from "@/features/hooks";
import { addOrUpdateItem, removeByCartItemId, setAll } from "@/store/cartSlice";
import type { AddPayload } from "@/types/cart";

export function useCartMutations() {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((s) => s.cart.items);

  const addMutation = useMutation({
    mutationFn: async (p: AddPayload) => {
      const res = await api.post(
        "https://restaurant-be-400174736012.asia-southeast2.run.app/api/cart",
        {
          restaurantId: p.restaurantId,
          menuId: p.menuId,
          quantity: p.quantity,
        },
      );
      return res.data.data.cartItem;
    },

    onMutate: async (p) => {
      const prev = [...cart];

      dispatch(
        addOrUpdateItem({
          restaurantId: p.restaurantId,
          restaurantName: p.restaurantName,
          restaurantLogo: p.restaurantLogo,
          menuId: p.menuId,
          foodName: p.foodName,
          price: p.price,
          image: p.image,
          quantity: p.quantity,
        }),
      );

      return { prev };
    },

    onError: (_err, _p, ctx) => {
      if (ctx?.prev) dispatch(setAll(ctx.prev));
    },

    onSuccess: (serverItem) => {
      dispatch(
        addOrUpdateItem({
          cartItemId: serverItem.id,
          restaurantId: serverItem.restaurant.id,
          restaurantName: serverItem.restaurant.name,
          restaurantLogo: serverItem.restaurant.logo,
          menuId: serverItem.menu.id,
          foodName: serverItem.menu.foodName,
          price: serverItem.menu.price,
          image: serverItem.menu.image,
          quantity: serverItem.quantity,
        }),
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      cartItemId,
      quantity,
    }: {
      cartItemId: number;
      quantity: number;
    }) => {
      const res = await api.put(
        `https://restaurant-be-400174736012.asia-southeast2.run.app/api/cart/${cartItemId}`,
        { quantity },
      );
      return res.data.data.cartItem;
    },

    onMutate: async ({ cartItemId, quantity }) => {
      const prev = [...cart];

      const current = cart.find((c) => c.cartItemId === cartItemId);
      if (current) {
        dispatch(
          addOrUpdateItem({
            ...current,
            quantity,
          }),
        );
      }

      return { prev };
    },

    onError: (_err, _p, ctx) => {
      if (ctx?.prev) dispatch(setAll(ctx.prev));
    },

    onSuccess: (serverItem) => {
      dispatch(
        addOrUpdateItem({
          cartItemId: serverItem.id,
          restaurantId: serverItem.restaurant.id,
          restaurantName: serverItem.restaurant.name,
          restaurantLogo: serverItem.restaurant.logo,
          menuId: serverItem.menu.id,
          foodName: serverItem.menu.foodName,
          price: serverItem.menu.price,
          image: serverItem.menu.image,
          quantity: serverItem.quantity,
        }),
      );
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (cartItemId: number) => {
      await api.delete(
        `https://restaurant-be-400174736012.asia-southeast2.run.app/api/cart/${cartItemId}`,
      );
      return cartItemId;
    },

    onMutate: async (cartItemId) => {
      const prev = [...cart];
      dispatch(removeByCartItemId({ cartItemId }));
      return { prev };
    },

    onError: (_err, _p, ctx) => {
      if (ctx?.prev) dispatch(setAll(ctx.prev));
    },
  });

  return {
    addMutation,
    updateMutation,
    removeMutation,
  };
}

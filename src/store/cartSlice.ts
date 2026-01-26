import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type CartItem = {
  cartItemId?: number;
  restaurantId: number;
  restaurantName: string;
  restaurantLogo?: string;
  menuId: number;
  foodName: string;
  price: number;
  image: string;
  quantity: number;
};

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

type AddOrUpdatePayload = CartItem;

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addOrUpdateItem(state, action: PayloadAction<AddOrUpdatePayload>) {
      const p = action.payload;

      const idx = state.items.findIndex(
        (it) => it.restaurantId === p.restaurantId && it.menuId === p.menuId,
      );

      if (idx === -1) {
        state.items.push({ ...p });
      } else {
        state.items[idx].quantity = p.quantity;

        if (p.cartItemId) {
          state.items[idx].cartItemId = p.cartItemId;
        }

        state.items[idx].restaurantName = p.restaurantName;
        state.items[idx].restaurantLogo = p.restaurantLogo;
        state.items[idx].foodName = p.foodName;
        state.items[idx].price = p.price;
        state.items[idx].image = p.image;
      }
    },

    removeItem(
      state,
      action: PayloadAction<{ restaurantId: number; menuId: number }>,
    ) {
      state.items = state.items.filter(
        (it) =>
          !(
            it.restaurantId === action.payload.restaurantId &&
            it.menuId === action.payload.menuId
          ),
      );
    },

    clearCart(state) {
      state.items = [];
    },
    removeByCartItemId(state, action: PayloadAction<{ cartItemId: number }>) {
      state.items = state.items.filter(
        (it) => it.cartItemId !== action.payload.cartItemId,
      );
    },

    setAll(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
    },
  },
});

export const { addOrUpdateItem, removeByCartItemId, setAll, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;

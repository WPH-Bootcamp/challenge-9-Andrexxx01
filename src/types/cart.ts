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

export interface CartState {
  items: CartItem[];
}

export type ServerCartItem = {
  id: number;
  restaurant: {
    id: number;
    name: string;
    logo: string;
  };
  menu: {
    id: number;
    foodName: string;
    price: number;
    image: string;
    type: "food" | "drink";
  };
  quantity: number;
};

export type AddPayload = {
  restaurantId: number;
  menuId: number;
  quantity: number;
  foodName: string;
  price: number;
  image: string;
  restaurantName: string;
  restaurantLogo: string;
};

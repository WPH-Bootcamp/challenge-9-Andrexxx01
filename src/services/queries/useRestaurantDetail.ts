import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAppSelector } from "@/features/hooks";

export interface RestaurantDetail {
  id: number;
  name: string;
  star: number;
  averageRating: number;
  place: string;
  logo: string;
  images: string[];
  category: string;
  totalMenus: number;
  totalReviews: number;
  menus: {
    id: number;
    foodName: string;
    price: number;
    type: "food" | "drink";
    image: string;
  }[];
  reviews: {
    id: number;
    star: number;
    comment: string | null;
    createdAt: string;
    user: {
      id: number;
      name: string;
      avatar: string | null;
    };
  }[];
}

async function fetchRestaurantDetail(id: number) {
  const res = await axios.get(
    `https://restaurant-be-400174736012.asia-southeast2.run.app/api/resto/${id}`,
    {
      params: {
        limitMenu: 20,
        limitReview: 20,
      },
    },
  );

  return res.data.data as RestaurantDetail;
}

export function useRestaurantDetail(id?: number) {
  const token = useAppSelector((s) => s.auth.token);

  return useQuery({
    queryKey: ["restaurant-detail", id],
    queryFn: () => fetchRestaurantDetail(id!),
    enabled: !!token && typeof id === "number" && !Number.isNaN(id),
  });
}

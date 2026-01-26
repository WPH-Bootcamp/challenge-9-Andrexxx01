import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api/axios";
import type { Restaurant } from "@/types/restaurant";
import { useAppSelector } from "@/features/hooks";

interface Params {
  location: string;
  range: number;
  priceMin: number;
  priceMax: number;
  rating: number;
  page: number;
  limit: number;
}

interface ApiResponse {
  success: boolean;
  data: {
    restaurants: (Restaurant & { distance: number })[];
  };
}

export function useAllRestaurants(params: Params) {
  const token = useAppSelector((s) => s.auth.token);

  return useQuery({
    queryKey: ["all-restaurants", params],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse>("/api/resto", {
        params,
      });
      return data.data.restaurants;
    },
    enabled: !!token,
  });
}

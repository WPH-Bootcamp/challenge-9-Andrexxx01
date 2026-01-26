import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api/axios";
import type {
  RecommendedResponse,
  BestSellerResponse,
} from "@/types/restaurant";
import { useAppSelector } from "@/features/hooks";

export function useRecommendedRestaurants() {
  const token = useAppSelector((s) => s.auth.token);
  return useQuery({
    queryKey: ["restaurants", "recommended"],
    queryFn: async () => {
      const { data } = await api.get<RecommendedResponse>(
        "/api/resto/recommended",
      );
      return data.data.recommendations;
    },
    enabled: !!token,
  });
}

export function useBestSellerRestaurants() {
  const token = useAppSelector((s) => s.auth.token);
  return useQuery({
    queryKey: ["restaurants", "best-seller"],
    queryFn: async () => {
      const { data } = await api.get<BestSellerResponse>(
        "/api/resto/best-seller",
      );
      return data.data.restaurants;
    },
    enabled: !!token,
  });
}

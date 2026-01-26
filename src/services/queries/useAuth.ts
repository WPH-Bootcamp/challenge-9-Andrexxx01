import { useMutation } from "@tanstack/react-query";
import { api } from "@/services/api/axios";
import type { LoginPayload, LoginResponse } from "@/types/auth";

interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data }= await api.post<LoginResponse>("/api/auth/login", payload);
      return data;
    },
  });
};

export function useRegisterMutation() {
  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const { data } = await api.post("/api/auth/register", payload);
      return data;
    },
  });
}
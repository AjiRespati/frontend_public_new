import { useQuery } from "@tanstack/react-query";
import api from "./client";

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get("/products");
      return res.data.data; // matches backend response { success, data }
    },
  });
};

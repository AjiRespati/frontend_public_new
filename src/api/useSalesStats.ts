import { useQuery } from "@tanstack/react-query";
import api from "./client";

export const useSalesStats = () => {
  return useQuery({
    queryKey: ["salesStats"],
    queryFn: async () => {
      const res = await api.get("/sales/stats");
      return res.data;
    },
  });
};

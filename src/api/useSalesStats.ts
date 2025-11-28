import { useQuery } from "@tanstack/react-query";
import api from "./client";

export const useSalesStats = (range: number = 7) => {
  return useQuery({
    queryKey: ["salesStats", range],
    queryFn: async () => {
      const res = await api.get(`/sales/stats?range=${range}`);
      return res.data;
    },
  });
};

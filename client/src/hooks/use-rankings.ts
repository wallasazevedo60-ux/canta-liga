import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useRankings() {
  return useQuery({
    queryKey: [api.rankings.list.path],
    queryFn: async () => {
      const res = await fetch(api.rankings.list.path);
      if (!res.ok) throw new Error("Failed to fetch rankings");
      return api.rankings.list.responses[200].parse(await res.json());
    },
  });
}

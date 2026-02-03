import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertBird } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useBirds() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const birdsQuery = useQuery({
    queryKey: [api.birds.list.path],
    queryFn: async () => {
      const res = await fetch(api.birds.list.path);
      if (!res.ok) throw new Error("Failed to fetch birds");
      return api.birds.list.responses[200].parse(await res.json());
    },
  });

  const createBirdMutation = useMutation({
    mutationFn: async (data: Omit<InsertBird, "ownerId">) => {
      const res = await fetch(api.birds.create.path, {
        method: api.birds.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Falha ao criar pássaro");
      return api.birds.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.birds.list.path] });
      toast({ title: "Sucesso", description: "Pássaro cadastrado com sucesso!" });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Erro", description: "Não foi possível cadastrar o pássaro." });
    },
  });

  const deleteBirdMutation = useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.birds.delete.path, { id });
      const res = await fetch(url, { method: api.birds.delete.method });
      if (!res.ok) throw new Error("Falha ao excluir");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.birds.list.path] });
      toast({ title: "Sucesso", description: "Pássaro removido." });
    },
  });

  return {
    birds: birdsQuery.data,
    isLoading: birdsQuery.isLoading,
    createBird: createBirdMutation.mutate,
    isCreating: createBirdMutation.isPending,
    deleteBird: deleteBirdMutation.mutate,
    isDeleting: deleteBirdMutation.isPending,
  };
}

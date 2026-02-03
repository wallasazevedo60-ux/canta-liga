import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertTraining } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useTrainings(birdId?: number) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const trainingsQuery = useQuery({
    queryKey: [api.trainings.list.path, birdId],
    enabled: !!birdId,
    queryFn: async () => {
      if (!birdId) return [];
      const url = buildUrl(api.trainings.list.path, { birdId });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch trainings");
      return api.trainings.list.responses[200].parse(await res.json());
    },
  });

  const createTrainingMutation = useMutation({
    mutationFn: async (data: InsertTraining) => {
      const res = await fetch(api.trainings.create.path, {
        method: api.trainings.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ...data,
            date: new Date(data.date).toISOString()
        }),
      });
      if (!res.ok) throw new Error("Falha ao salvar treino");
      return api.trainings.create.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.trainings.list.path, variables.birdId] });
      toast({ title: "Treino Salvo", description: "Os dados foram registrados." });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Erro", description: "Não foi possível salvar o treino." });
    }
  });

  return {
    trainings: trainingsQuery.data,
    isLoading: trainingsQuery.isLoading,
    saveTraining: createTrainingMutation.mutate,
    isSaving: createTrainingMutation.isPending,
  };
}

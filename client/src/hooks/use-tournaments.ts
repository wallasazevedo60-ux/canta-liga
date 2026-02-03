import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertTournament } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useTournaments() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const tournamentsQuery = useQuery({
    queryKey: [api.tournaments.list.path],
    queryFn: async () => {
      const res = await fetch(api.tournaments.list.path);
      if (!res.ok) throw new Error("Failed to fetch tournaments");
      return api.tournaments.list.responses[200].parse(await res.json());
    },
  });

  const createTournamentMutation = useMutation({
    mutationFn: async (data: Omit<InsertTournament, "organizerId">) => {
      // Ensure date is ISO string if it's a Date object
      const payload = {
        ...data,
        date: new Date(data.date).toISOString()
      };
      
      const res = await fetch(api.tournaments.create.path, {
        method: api.tournaments.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Falha ao criar torneio");
      return api.tournaments.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.tournaments.list.path] });
      toast({ title: "Sucesso", description: "Torneio criado com sucesso!" });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Erro", description: "Não foi possível criar o torneio." });
    },
  });

  const enrollMutation = useMutation({
    mutationFn: async ({ tournamentId, birdId }: { tournamentId: number, birdId: number }) => {
      const url = buildUrl(api.tournaments.enroll.path, { id: tournamentId });
      const res = await fetch(url, {
        method: api.tournaments.enroll.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ birdId }),
      });
      if (!res.ok) {
         const err = await res.json();
         throw new Error(err.message || "Falha na inscrição");
      }
      return api.tournaments.enroll.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      toast({ title: "Inscrição confirmada!", description: "Boa sorte na competição." });
    },
    onError: (err: Error) => {
      toast({ variant: "destructive", title: "Erro na inscrição", description: err.message });
    }
  });

  return {
    tournaments: tournamentsQuery.data,
    isLoading: tournamentsQuery.isLoading,
    createTournament: createTournamentMutation.mutate,
    isCreating: createTournamentMutation.isPending,
    enroll: enrollMutation.mutate,
    isEnrolling: enrollMutation.isPending,
  };
}

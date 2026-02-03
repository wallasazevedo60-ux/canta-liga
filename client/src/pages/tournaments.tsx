import { useState } from "react";
import { useTournaments } from "@/hooks/use-tournaments";
import { useAuth } from "@/hooks/use-auth";
import { useBirds } from "@/hooks/use-birds";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BottomNav } from "@/components/bottom-nav";
import { MapPin, Calendar, DollarSign, Trophy, User } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTournamentSchema } from "@shared/schema";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TournamentsPage() {
  const { user } = useAuth();
  const { tournaments, createTournament, enroll, isCreating, isEnrolling } = useTournaments();
  const { birds } = useBirds();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [enrollOpen, setEnrollOpen] = useState<number | null>(null);

  const form = useForm<z.infer<typeof insertTournamentSchema>>({
    resolver: zodResolver(insertTournamentSchema.omit({ organizerId: true })),
    defaultValues: { name: "", location: "", description: "", entryFee: 0 },
  });

  const onSubmitCreate = (data: any) => {
    // Convert string date to Date object for the hook
    const payload = { ...data, date: new Date(data.date) };
    
    createTournament(payload, {
      onSuccess: () => {
        setIsCreateOpen(false);
        form.reset();
      }
    });
  };

  const handleEnroll = (tournamentId: number, birdId: string) => {
    enroll({ tournamentId, birdId: parseInt(birdId) }, {
      onSuccess: () => setEnrollOpen(null)
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-border p-4 sticky top-0 z-10 flex justify-between items-center">
        <h1 className="text-xl font-display font-bold">Torneios</h1>
        {user?.role === "organizador" && (
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Novo Torneio
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Criar Torneio</DialogTitle></DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitCreate)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Evento</FormLabel>
                        <FormControl><Input placeholder="Torneio de Verão" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Local</FormLabel>
                        <FormControl><Input placeholder="Ginásio Municipal..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data e Hora</FormLabel>
                          <FormControl>
                            <Input 
                              type="datetime-local" 
                              {...field} 
                              value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ''}
                              onChange={(e) => field.onChange(new Date(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="entryFee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Inscrição (R$)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={e => field.onChange(parseFloat(e.target.value))} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Regras / Info</FormLabel>
                        <FormControl><Textarea placeholder="Detalhes do evento..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isCreating}>Criar Evento</Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </header>

      <main className="max-w-md mx-auto p-4 space-y-4">
        {tournaments?.map((tournament) => (
          <Card key={tournament.id} className="overflow-hidden border-l-4 border-l-secondary">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{tournament.name}</CardTitle>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <User className="w-3 h-3" /> Org: {tournament.organizer.name}
                  </p>
                </div>
                {tournament.status === 'aberto' && (
                  <span className="bg-green-500/20 text-green-500 text-xs px-2 py-1 rounded-full font-bold">ABERTO</span>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pb-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 text-primary" />
                {format(new Date(tournament.date), "dd 'de' MMM 'às' HH:mm", { locale: ptBR })}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                {tournament.location}
              </div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <DollarSign className="w-4 h-4 text-secondary" />
                Inscrição: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tournament.entryFee || 0)}
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              {user?.role === "criador" ? (
                <Dialog open={enrollOpen === tournament.id} onOpenChange={(open) => setEnrollOpen(open ? tournament.id : null)}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20">
                      Inscrever-se
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-xs">
                    <DialogHeader><DialogTitle>Escolha o Pássaro</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-2">
                      <Select onValueChange={(val) => handleEnroll(tournament.id, val)}>
                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        <SelectContent>
                          {birds?.map(bird => (
                            <SelectItem key={bird.id} value={bird.id.toString()}>{bird.name} ({bird.species})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </DialogContent>
                </Dialog>
              ) : (
                <Button variant="outline" className="w-full">Gerenciar Inscrições</Button>
              )}
            </CardFooter>
          </Card>
        ))}
        {tournaments?.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Nenhum torneio agendado no momento.
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}

import { useState } from "react";
import { useBirds } from "@/hooks/use-birds";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit2, Bird as BirdIcon } from "lucide-react";
import { BottomNav } from "@/components/bottom-nav";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBirdSchema } from "@shared/schema";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function MyBirdsPage() {
  const { birds, isLoading, createBird, deleteBird, isCreating } = useBirds();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof insertBirdSchema>>({
    resolver: zodResolver(insertBirdSchema.omit({ ownerId: true })),
    defaultValues: { name: "", species: "", ringNumber: "", notes: "", photoUrl: "" },
  });

  const onSubmit = (data: any) => {
    createBird(data, {
      onSuccess: () => {
        setIsDialogOpen(false);
        form.reset();
      },
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-border p-4 sticky top-0 z-10">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <h1 className="text-xl font-display font-bold text-foreground">Meu Plantel</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="w-4 h-4 mr-1" /> Novo Pássaro
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Cadastrar Pássaro</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl><Input placeholder="Ex: Trovão" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="species"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Espécie</FormLabel>
                          <FormControl><Input placeholder="Ex: Coleiro" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ringNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Anilha (Opcional)</FormLabel>
                          <FormControl><Input placeholder="000123" {...field} value={field.value || ''} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observações</FormLabel>
                        <FormControl><Input placeholder="Genética, histórico..." {...field} value={field.value || ''} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isCreating}>
                    {isCreating ? "Salvando..." : "Salvar Pássaro"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : birds?.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="bg-muted/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <BirdIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground">Nenhum pássaro ainda</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Cadastre seus pássaros para começar a treinar e competir.
            </p>
          </div>
        ) : (
          birds?.map((bird) => (
            <Card key={bird.id} className="overflow-hidden border-border/50 hover:border-primary/50 transition-colors">
              <div className="flex">
                <div className="w-24 bg-muted/30 flex items-center justify-center border-r border-border/50">
                  {bird.photoUrl ? (
                    <img src={bird.photoUrl} alt={bird.name} className="w-full h-full object-cover" />
                  ) : (
                    <BirdIcon className="w-8 h-8 text-muted-foreground/50" />
                  )}
                </div>
                <div className="flex-1 p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{bird.name}</h3>
                      <p className="text-sm text-primary font-medium">{bird.species}</p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive/90 -mt-1 -mr-2">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir pássaro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Isso removerá permanentemente o pássaro e todo seu histórico de treinos.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteBird(bird.id)} className="bg-destructive text-destructive-foreground">Excluir</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                    {bird.ringNumber && (
                      <span className="bg-muted px-2 py-0.5 rounded">Anilha: {bird.ringNumber}</span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </main>
      <BottomNav />
    </div>
  );
}

import { useState } from "react";
import { useBirds } from "@/hooks/use-birds";
import { useTrainings } from "@/hooks/use-trainings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BottomNav } from "@/components/bottom-nav";
import { CounterWidget } from "@/components/counter-widget";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PlayCircle, History, TrendingUp } from "lucide-react";

export default function TrainingPage() {
  const { birds } = useBirds();
  const [selectedBirdId, setSelectedBirdId] = useState<string>("");
  const [isCounterActive, setIsCounterActive] = useState(false);
  
  const { trainings, saveTraining, isLoading } = useTrainings(selectedBirdId ? parseInt(selectedBirdId) : undefined);

  const handleCompleteTraining = (duration: number, count: number) => {
    setIsCounterActive(false);
    if (!selectedBirdId) return;

    saveTraining({
      birdId: parseInt(selectedBirdId),
      date: new Date(), // Sending Date object, hook will convert to ISO
      type: "Velocidade", // Default for now, could be selectable
      duration: duration, // seconds
      songCount: count,
      notes: ""
    });
  };

  const chartData = trainings?.map(t => ({
    date: format(new Date(t.date), 'dd/MM', { locale: ptBR }),
    media: t.songCount && t.duration ? Math.round((t.songCount / (t.duration / 60))) : 0
  })).slice(-10); // Last 10 trainings

  const selectedBird = birds?.find(b => b.id.toString() === selectedBirdId);

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="bg-card border-b border-border p-4 sticky top-0 z-10">
        <h1 className="text-xl font-display font-bold text-center">Central de Treino</h1>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        {/* Bird Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground ml-1">Selecione o Atleta</label>
          <Select value={selectedBirdId} onValueChange={setSelectedBirdId}>
            <SelectTrigger className="h-12 text-lg">
              <SelectValue placeholder="Escolha um pássaro..." />
            </SelectTrigger>
            <SelectContent>
              {birds?.map(bird => (
                <SelectItem key={bird.id} value={bird.id.toString()}>
                  {bird.name} <span className="text-muted-foreground text-xs ml-2">({bird.species})</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedBirdId ? (
          <>
            <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold">{selectedBird?.name}</h2>
                  <p className="text-sm text-muted-foreground">Pronto para treinar?</p>
                </div>
                
                <Button 
                  size="lg" 
                  className="w-full h-16 text-lg font-bold shadow-lg shadow-primary/20 rounded-xl"
                  onClick={() => setIsCounterActive(true)}
                >
                  <PlayCircle className="w-6 h-6 mr-2" /> Iniciar Contador
                </Button>
              </CardContent>
            </Card>

            {/* Stats Chart */}
            {trainings && trainings.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-1">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-sm">Evolução (Cantos/min)</h3>
                </div>
                <div className="h-48 w-full bg-card rounded-xl p-4 border border-border/50">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <XAxis dataKey="date" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Line type="monotone" dataKey="media" stroke="var(--primary)" strokeWidth={3} dot={{ fill: 'var(--primary)' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* History List */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <History className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold text-sm text-muted-foreground">Histórico Recente</h3>
              </div>
              
              {trainings?.slice().reverse().map(training => (
                <div key={training.id} className="bg-card border border-border/50 p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm">
                      {format(new Date(training.date), "dd 'de' MMMM", { locale: ptBR })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {Math.floor(training.duration / 60)} min • {training.songCount} cantos
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-primary">
                      {training.songCount && training.duration 
                        ? (training.songCount / (training.duration / 60)).toFixed(1) 
                        : 0}
                    </span>
                    <p className="text-[10px] uppercase text-muted-foreground font-medium">Cantos/Min</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            Selecione um pássaro acima para ver os treinos.
          </div>
        )}
      </main>

      <CounterWidget 
        isActive={isCounterActive} 
        onComplete={handleCompleteTraining} 
        birdName={selectedBird?.name || ""} 
      />
      
      <BottomNav />
    </div>
  );
}

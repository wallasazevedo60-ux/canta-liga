import { useRankings } from "@/hooks/use-rankings";
import { Card } from "@/components/ui/card";
import { BottomNav } from "@/components/bottom-nav";
import { Trophy, Medal, Award } from "lucide-react";

export default function RankingPage() {
  const { data: rankings, isLoading } = useRankings();

  const getMedalIcon = (index: number) => {
    switch(index) {
      case 0: return <Trophy className="w-6 h-6 text-yellow-500 fill-current" />;
      case 1: return <Medal className="w-6 h-6 text-gray-400 fill-current" />;
      case 2: return <Medal className="w-6 h-6 text-amber-700 fill-current" />;
      default: return <span className="text-lg font-bold text-muted-foreground font-mono w-6 text-center">{index + 1}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-border p-4 sticky top-0 z-10">
        <h1 className="text-xl font-display font-bold text-center">Ranking Regional</h1>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-4">
        <div className="bg-gradient-to-r from-secondary/20 to-secondary/5 border border-secondary/20 rounded-xl p-4 text-center mb-6">
          <h2 className="text-lg font-bold text-secondary-foreground flex items-center justify-center gap-2">
            <Award className="w-5 h-5" /> Temporada 2024
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Os melhores cantores da região</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
        ) : (
          <div className="space-y-2">
            {rankings?.map((item, index) => (
              <Card key={index} className="flex items-center p-4 border-border/40 hover:bg-muted/20 transition-colors">
                <div className="mr-4 flex-shrink-0 flex items-center justify-center w-8">
                  {getMedalIcon(index)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-base truncate">{item.birdName}</h3>
                    <span className="text-sm font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {item.totalScore} pts
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground flex justify-between">
                    <span>{item.ownerName}</span>
                    <span className="opacity-70">{item.species}</span>
                  </p>
                </div>
              </Card>
            ))}
            
            {rankings?.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Ainda não há dados de ranking para exibir.
              </div>
            )}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}

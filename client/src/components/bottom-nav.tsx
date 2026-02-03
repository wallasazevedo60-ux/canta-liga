import { Link, useLocation } from "wouter";
import { Bird, Trophy, User, Timer, BarChart3 } from "lucide-react";

export function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-card border-t border-border shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] pb-safe">
      <div className="flex h-full items-center justify-around max-w-md mx-auto">
        <Link href="/birds" className={`bottom-nav-item ${location === '/birds' ? 'text-primary' : 'text-muted-foreground'}`}>
          <div className="flex flex-col items-center gap-1">
            <Bird className="h-5 w-5" />
            <span className="text-[10px] font-medium">Plantel</span>
          </div>
        </Link>
        
        <Link href="/training" className={`bottom-nav-item ${location === '/training' ? 'text-primary' : 'text-muted-foreground'}`}>
          <div className="flex flex-col items-center gap-1">
            <Timer className="h-5 w-5" />
            <span className="text-[10px] font-medium">Treinos</span>
          </div>
        </Link>

        <Link href="/tournaments" className={`bottom-nav-item ${location === '/tournaments' ? 'text-primary' : 'text-muted-foreground'}`}>
          <div className="flex flex-col items-center gap-1">
            <Trophy className="h-5 w-5" />
            <span className="text-[10px] font-medium">Torneios</span>
          </div>
        </Link>

        <Link href="/ranking" className={`bottom-nav-item ${location === '/ranking' ? 'text-primary' : 'text-muted-foreground'}`}>
          <div className="flex flex-col items-center gap-1">
            <BarChart3 className="h-5 w-5" />
            <span className="text-[10px] font-medium">Ranking</span>
          </div>
        </Link>

        <Link href="/profile" className={`bottom-nav-item ${location === '/profile' ? 'text-primary' : 'text-muted-foreground'}`}>
          <div className="flex flex-col items-center gap-1">
            <User className="h-5 w-5" />
            <span className="text-[10px] font-medium">Perfil</span>
          </div>
        </Link>
      </div>
    </nav>
  );
}

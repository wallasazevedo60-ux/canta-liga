import { useState, useEffect, useRef } from "react";
import { Play, Pause, Square, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface CounterWidgetProps {
  onComplete: (durationSeconds: number, count: number) => void;
  isActive: boolean;
  birdName: string;
}

export function CounterWidget({ onComplete, isActive, birdName }: CounterWidgetProps) {
  const [count, setCount] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setElapsed(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const handleIncrement = () => {
    if (!isRunning) setIsRunning(true);
    setCount(prev => prev + 1);
    
    // Haptic feedback if available
    if (navigator.vibrate) navigator.vibrate(10);
  };

  const handleStop = () => {
    setIsRunning(false);
    onComplete(elapsed, count);
    // Reset internal state after saving is handled by parent or if canceled
    setCount(0);
    setElapsed(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const avg = elapsed > 0 ? (count / (elapsed / 60)).toFixed(1) : "0.0";

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Treinando: {birdName}</h2>
          <div className="text-6xl font-mono tabular-nums text-primary font-bold">
            {formatTime(elapsed)}
          </div>
          <p className="text-muted-foreground">Média: {avg} cantos/min</p>
        </div>

        {/* Massive Button Area */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleIncrement}
          className="w-full aspect-square rounded-full bg-gradient-to-br from-primary to-primary/60 shadow-[0_0_40px_-10px_rgba(34,197,94,0.3)] border-8 border-background flex flex-col items-center justify-center group"
        >
          <Plus className="w-24 h-24 text-white drop-shadow-md group-active:scale-110 transition-transform" />
          <span className="text-3xl font-bold text-white mt-2">{count}</span>
          <span className="text-white/80 text-sm uppercase tracking-wider font-semibold mt-1">Toque para contar</span>
        </motion.button>

        <div className="flex gap-4 justify-center">
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full h-14 text-lg border-2"
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? (
              <><Pause className="mr-2 h-5 w-5" /> Pausar</>
            ) : (
              <><Play className="mr-2 h-5 w-5" /> Continuar</>
            )}
          </Button>
          
          <Button 
            variant="destructive" 
            size="lg" 
            className="w-full h-14 text-lg"
            onClick={handleStop}
          >
            <Square className="mr-2 h-5 w-5 fill-current" /> Finalizar
          </Button>
        </div>
      </div>
    </div>
  );
}

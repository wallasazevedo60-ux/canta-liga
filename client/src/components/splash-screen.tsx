import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bird } from "lucide-react";

export function SplashScreen({ onFinish }: { onFinish: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background text-foreground">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-ring" />
        <div className="relative z-10 bg-primary/10 p-6 rounded-full border border-primary/20 backdrop-blur-sm">
          <Bird className="w-16 h-16 text-primary" strokeWidth={1.5} />
        </div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-8 text-center"
      >
        <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          CantaLiga
        </h1>
        <p className="mt-2 text-sm text-muted-foreground tracking-widest uppercase">
          Competição & Paixão
        </p>
      </motion.div>
    </div>
  );
}

import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center border-border/50">
        <CardContent className="pt-6">
          <div className="mb-4 flex justify-center">
            <AlertTriangle className="h-12 w-12 text-destructive opacity-80" />
          </div>
          <h1 className="text-2xl font-bold font-display mb-2">Página não encontrada</h1>
          <p className="text-muted-foreground mb-6">
            O recurso que você está procurando não existe ou foi movido.
          </p>
          <Link href="/">
            <Button className="w-full">Voltar ao Início</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

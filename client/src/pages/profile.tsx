import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BottomNav } from "@/components/bottom-nav";
import { LogOut, User, Mail, Shield } from "lucide-react";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-gradient-to-b from-primary/20 to-background pt-12 pb-8 px-4 text-center">
        <div className="w-24 h-24 bg-card rounded-full mx-auto flex items-center justify-center shadow-xl border-4 border-card mb-4">
          <User className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold font-display">{user?.name}</h1>
        <p className="text-muted-foreground">@{user?.username}</p>
        <span className="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-bold uppercase tracking-wider">
          {user?.role}
        </span>
      </div>

      <main className="max-w-md mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground uppercase">Usuário</p>
                <p className="font-medium">{user?.username}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground uppercase">Permissão</p>
                <p className="font-medium capitalize">{user?.role}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button 
          variant="destructive" 
          className="w-full h-12 text-base"
          onClick={() => logout()}
        >
          <LogOut className="w-5 h-5 mr-2" /> Sair da Conta
        </Button>
      </main>
      <BottomNav />
    </div>
  );
}

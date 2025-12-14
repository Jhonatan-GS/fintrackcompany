import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BarChart3, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WelcomeModalProps {
  open: boolean;
  onClose: () => void;
}

export const WelcomeModal = ({ open, onClose }: WelcomeModalProps) => {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-md text-center">
        <div className="py-6">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-6">
            <BarChart3 className="w-10 h-10 text-primary-foreground" />
          </div>
          
          <h2 className="text-xl font-bold text-foreground mb-2">
            ¡Todo listo para empezar!
          </h2>
          <p className="text-muted-foreground mb-6">
            Cuando recibas tu primera notificación bancaria por email, 
            tus transacciones aparecerán automáticamente.
          </p>
          
          <div className="flex items-center justify-center gap-2 text-primary mb-6">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm">Sincronización activa cada 5 minutos</span>
          </div>

          <div className="bg-muted/50 rounded-xl p-4 text-left mb-6">
            <p className="text-foreground text-sm font-medium mb-3">Mientras tanto, puedes:</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                Asegurarte de tener las notificaciones de tu banco activas en tu email
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                Realizar una compra pequeña para probar la sincronización
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                Explorar el dashboard con datos de ejemplo
              </li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Entendido
            </Button>
            <Button className="flex-1" onClick={() => navigate('/demo')}>
              Ver demo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

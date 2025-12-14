import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const DashboardEmptyState = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-fade-in">
        <span className="text-5xl">📊</span>
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2 animate-fade-in">
        ¡Todo listo para empezar!
      </h2>
      <p className="text-muted-foreground max-w-md mb-6 animate-fade-in">
        Cuando recibas tu primera notificación bancaria por email,
        tus transacciones aparecerán aquí automáticamente.
      </p>
      <div className="flex items-center gap-2 text-primary animate-fade-in">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span className="text-sm">Sincronización activa cada 5 minutos</span>
      </div>
      
      <div className="mt-8 p-6 glass-card rounded-2xl max-w-md w-full animate-fade-in">
        <h3 className="font-semibold text-foreground mb-3">
          Mientras tanto, puedes:
        </h3>
        <ul className="space-y-3 text-left text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            Asegurarte de tener las notificaciones de tu banco activas en tu email
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            Realizar una compra pequeña para probar la sincronización
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            Explorar el dashboard con datos de ejemplo
          </li>
        </ul>
        <Button
          variant="outline"
          className="w-full mt-4 border-border hover:bg-muted"
          onClick={() => navigate("/demo")}
        >
          Ver demo con datos de ejemplo
        </Button>
      </div>
    </div>
  );
};

export default DashboardEmptyState;

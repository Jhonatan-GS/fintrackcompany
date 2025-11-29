import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const Pricing = () => {
  const features = [
    "Conexión ilimitada de bancos",
    "Sincronización automática de emails",
    "Categorías personalizadas",
    "Dashboard y reportes",
    "Notificaciones Telegram",
  ];

  return (
    <section id="precios" className="py-20 px-4 bg-secondary/50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Precios</h2>
          <p className="text-xl text-muted-foreground">
            Simple, transparente, y gratis para siempre
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="glass-card p-8 rounded-3xl border-2 border-primary/50 relative overflow-hidden">
            {/* Gradient background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl -z-10" />

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Gratis para siempre</h3>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-5xl font-bold text-gradient">$0</span>
                <span className="text-muted-foreground">COP/mes</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <Button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold h-12 glow-primary">
              Crear cuenta gratis
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Sin tarjeta de crédito requerida
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

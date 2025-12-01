import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Pricing = () => {
  const navigate = useNavigate();
  
  const freeFeatures = [
    "1 cuenta bancaria conectada",
    "Sincronización cada 24 horas",
    "Categorías básicas",
    "Dashboard simple",
    "Notificaciones Telegram",
  ];

  const proFeatures = [
    "Bancos ilimitados",
    "Sincronización en tiempo real",
    "Categorías personalizadas ilimitadas",
    "Dashboard avanzado con reportes",
    "Notificaciones Telegram prioritarias",
    "Exportar datos (CSV, PDF)",
    "Soporte prioritario",
  ];

  const handleProClick = () => {
    console.log('Plan Pro selected');
    navigate("/login");
  };

  return (
    <section id="precios" className="py-12 sm:py-20 px-4 bg-secondary/50">
      <div className="container mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">Precios</h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground px-4">
            Simple, transparente, y accesible
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {/* Plan Gratis */}
          <div className="glass-card p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-border relative overflow-hidden">
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-bold mb-2">Gratis</h3>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-4xl sm:text-5xl font-bold">$0</span>
                <span className="text-muted-foreground">COP/mes</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Para siempre</p>
            </div>

            <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              {freeFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-foreground text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <Button 
              onClick={() => navigate("/login")}
              variant="outline"
              className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold h-12 transition-all"
            >
              Comenzar gratis
            </Button>
          </div>

          {/* Plan Pro - Destacado */}
          <div className="glass-card p-6 sm:p-8 rounded-2xl sm:rounded-3xl border-2 border-primary relative overflow-hidden shadow-lg shadow-primary/20">
            {/* Badge Recomendado */}
            <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
              <div className="flex items-center gap-1 bg-primary text-white px-2 sm:px-3 py-1 rounded-full text-xs font-semibold">
                <Sparkles className="w-3 h-3" />
                Recomendado
              </div>
            </div>

            {/* Gradient background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl -z-10" />

            <div className="text-center mb-6 sm:mb-8 mt-4">
              <h3 className="text-xl sm:text-2xl font-bold mb-2">Pro</h3>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-4xl sm:text-5xl font-bold text-gradient">$10</span>
                <span className="text-muted-foreground">USD/mes</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">por mes</p>
            </div>

            <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              {proFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-foreground text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <Button 
              onClick={handleProClick}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold h-12 glow-primary"
            >
              Comenzar prueba gratis
            </Button>

            <p className="text-center text-xs text-muted-foreground mt-3">
              14 días gratis, luego $10/mes
            </p>
          </div>
        </div>

        <p className="text-center text-xs sm:text-sm text-muted-foreground mt-6 sm:mt-8 px-4">
          Sin tarjeta de crédito requerida para el plan gratis
        </p>
      </div>
    </section>
  );
};

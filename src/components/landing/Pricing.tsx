import { Button } from "@/components/ui/button";
import { Check, Sparkles, Users, Building2, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Pricing = () => {
  const navigate = useNavigate();
  
  const freeFeatures = [
    "1 cuenta bancaria conectada",
    "50 transacciones por mes",
    "Dashboard básico",
    "Notificaciones WhatsApp",
  ];

  const proFeatures = [
    "Bancos ilimitados",
    "Transacciones ilimitadas",
    "WhatsApp AI asistente",
    "Reportes avanzados",
    "Exportar datos (CSV, PDF)",
    "Soporte prioritario",
  ];

  const familyFeatures = [
    "Hasta 4 usuarios",
    "Todo lo del plan Pro",
    "Presupuesto compartido",
    "Metas familiares",
    "Dashboard familiar unificado",
  ];

  const enterpriseFeatures = [
    "Usuarios ilimitados",
    "Automatización de Procurement",
    "Integraciones empresariales",
    "API personalizada",
    "Soporte dedicado 24/7",
  ];

  return (
    <section id="precios" className="py-12 sm:py-20 px-4 bg-secondary/50">
      <div className="container mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">Precios</h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground px-4">
            Simple, transparente, y accesible
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
          {/* Plan Gratis */}
          <div className="glass-card p-5 sm:p-6 rounded-2xl border border-border relative overflow-hidden flex flex-col">
            <div className="text-center mb-5">
              <h3 className="text-lg sm:text-xl font-bold mb-2">Free</h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-3xl sm:text-4xl font-bold">$0</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Para siempre</p>
            </div>

            <ul className="space-y-2.5 mb-5 flex-grow">
              {freeFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-2.5 h-2.5 text-primary" />
                  </div>
                  <span className="text-foreground text-xs sm:text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <Button 
              onClick={() => navigate("/login")}
              variant="outline"
              className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold h-10 transition-all text-sm"
            >
              Comenzar gratis
            </Button>
          </div>

          {/* Plan Pro - Destacado */}
          <div className="glass-card p-5 sm:p-6 rounded-2xl border-2 border-primary relative overflow-hidden shadow-lg shadow-primary/20 flex flex-col">
            <div className="absolute top-2 right-2">
              <div className="flex items-center gap-1 bg-primary text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                <Sparkles className="w-3 h-3" />
                Popular
              </div>
            </div>

            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl -z-10" />

            <div className="text-center mb-5 mt-3">
              <h3 className="text-lg sm:text-xl font-bold mb-2">Pro</h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-3xl sm:text-4xl font-bold text-gradient">$5</span>
                <span className="text-muted-foreground text-xs">USD/mes</span>
              </div>
            </div>

            <ul className="space-y-2.5 mb-5 flex-grow">
              {proFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-2.5 h-2.5 text-primary" />
                  </div>
                  <span className="text-foreground text-xs sm:text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <Button 
              onClick={() => navigate("/login")}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold h-10 glow-primary text-sm"
            >
              Comenzar prueba gratis
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-2">
              7 días gratis
            </p>
          </div>

          {/* Plan Familia - Próximamente */}
          <div className="glass-card p-5 sm:p-6 rounded-2xl border border-border relative overflow-hidden flex flex-col opacity-80">
            <div className="absolute top-2 right-2">
              <div className="flex items-center gap-1 bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-xs font-semibold">
                <Clock className="w-3 h-3" />
                Próximamente
              </div>
            </div>

            <div className="text-center mb-5 mt-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-2">
                <Users className="w-5 h-5 text-muted-foreground" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">Familia</h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-3xl sm:text-4xl font-bold text-muted-foreground">$15</span>
                <span className="text-muted-foreground text-xs">USD/mes</span>
              </div>
            </div>

            <ul className="space-y-2.5 mb-5 flex-grow">
              {familyFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <Check className="w-2.5 h-2.5 text-muted-foreground" />
                  </div>
                  <span className="text-muted-foreground text-xs sm:text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <Button 
              disabled
              variant="outline"
              className="w-full font-semibold h-10 text-sm"
            >
              Próximamente
            </Button>
          </div>

          {/* Plan Empresas - Próximamente */}
          <div className="glass-card p-5 sm:p-6 rounded-2xl border border-border relative overflow-hidden flex flex-col opacity-80">
            <div className="absolute top-2 right-2">
              <div className="flex items-center gap-1 bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-xs font-semibold">
                <Clock className="w-3 h-3" />
                Próximamente
              </div>
            </div>

            <div className="text-center mb-5 mt-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-2">
                <Building2 className="w-5 h-5 text-muted-foreground" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">Empresas</h3>
              <p className="text-xs text-muted-foreground">Personalizado</p>
            </div>

            <ul className="space-y-2.5 mb-5 flex-grow">
              {enterpriseFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <Check className="w-2.5 h-2.5 text-muted-foreground" />
                  </div>
                  <span className="text-muted-foreground text-xs sm:text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <Button 
              disabled
              variant="outline"
              className="w-full font-semibold h-10 text-sm"
            >
              Contáctanos
            </Button>
          </div>
        </div>

        <p className="text-center text-xs sm:text-sm text-muted-foreground mt-6 sm:mt-8 px-4">
          Sin tarjeta de crédito requerida para comenzar
        </p>
      </div>
    </section>
  );
};

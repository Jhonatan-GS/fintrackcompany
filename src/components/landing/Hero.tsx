import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import dashboardMockup from "@/assets/dashboard-mockup.jpg";
import { useNavigate } from "react-router-dom";
import { WaitlistModal } from "./WaitlistModal";

export const Hero = () => {
  const navigate = useNavigate();
  const [showWaitlist, setShowWaitlist] = useState(false);

  return (
    <section className="pt-20 sm:pt-32 pb-12 sm:pb-20 px-4">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Tus finanzas en{" "}
                <span className="text-gradient">piloto automático</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
                Conecta tu email, y FinTrack rastrea automáticamente cada pago y
                transferencia de tus bancos colombianos. Sin ingresar datos
                manualmente.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
              <Button
                size="lg"
                onClick={() => setShowWaitlist(true)}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-semibold px-4 sm:px-8 h-12 text-sm sm:text-base glow-primary transition-all hover:scale-105"
              >
                🚀 Unirme a la lista de espera
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/demo")}
                className="border-border hover:bg-muted h-12 px-8"
              >
                Ver demo
              </Button>
            </div>

            <p className="text-muted-foreground/70 text-sm text-center sm:text-left mt-4">
              🎉 Más de 500 personas en la lista de espera
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 sm:gap-6 pt-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <span>Gratis para siempre</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <span>Bancolombia, Nequi, Nu y más</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <span>100% seguro</span>
              </div>
            </div>
          </div>

          {/* Right Content - Mockup */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl -z-10" />
            <div className="glass-card rounded-2xl overflow-hidden p-4 hover:border-primary/30 transition-all duration-500">
              <img
                src={dashboardMockup}
                alt="Dashboard preview"
                className="w-full rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Waitlist Modal */}
      <WaitlistModal open={showWaitlist} onClose={() => setShowWaitlist(false)} />
    </section>
  );
};

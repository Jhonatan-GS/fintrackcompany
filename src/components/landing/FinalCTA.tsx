import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const FinalCTA = () => {
  const navigate = useNavigate();
  return (
    <section className="py-12 sm:py-20 px-4">
      <div className="container mx-auto">
        <div className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-16 text-center relative overflow-hidden">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-accent/20 to-primary/30 -z-10" />
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
            Empieza a entender tu dinero hoy
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
            Únete a los colombianos que ya tienen sus finanzas bajo control
          </p>

          <Button
            size="lg"
            onClick={() => navigate("/login")}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-semibold px-4 sm:px-8 md:px-12 h-12 sm:h-14 text-sm sm:text-base md:text-lg glow-primary transition-all hover:scale-105"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="hidden sm:inline">Comenzar gratis con Google</span>
            <span className="sm:hidden">Comenzar gratis</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

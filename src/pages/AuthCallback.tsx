import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp } from "lucide-react";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL
        const { data, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Error getting session:", sessionError);
          setError("Error al procesar la autenticación");
          setTimeout(() => navigate("/login"), 3000);
          return;
        }

        if (data.session) {
          // Successfully authenticated, redirect to dashboard
          navigate("/dashboard", { replace: true });
        } else {
          // No session found
          setError("No se pudo iniciar sesión");
          setTimeout(() => navigate("/login"), 3000);
        }
      } catch (err) {
        console.error("Unexpected error in auth callback:", err);
        setError("Error inesperado");
        setTimeout(() => navigate("/login"), 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        {/* Logo with pulse animation */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center animate-pulse">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
        </div>

        {error ? (
          <>
            <div className="w-16 h-16 border-4 border-destructive rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">✕</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-destructive">{error}</h2>
              <p className="text-muted-foreground">
                Redirigiendo a la página de inicio de sesión...
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Iniciando sesión...</h2>
              <p className="text-muted-foreground">
                Por favor espera mientras procesamos tu autenticación
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;

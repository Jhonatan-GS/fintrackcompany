import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { TrendingUp } from "lucide-react";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('=== AUTH CALLBACK ===');
        console.log('URL actual:', window.location.href);
        
        // Obtener la sesión del hash de la URL
        const { data, error } = await supabase.auth.getSession();
        
        console.log('Session data:', data);
        console.log('Session error:', error);
        
        if (error) {
          console.error('Error obteniendo sesión:', error);
          setError(error.message);
          setTimeout(() => navigate('/login'), 3000);
          return;
        }
        
        if (data?.session) {
          console.log('✅ Sesión válida, usuario:', data.session.user.email);
          // Redirigir al dashboard
          navigate('/dashboard', { replace: true });
        } else {
          console.log('No hay sesión, verificando hash...');
          
          // Intentar intercambiar el código por sesión
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          
          if (accessToken) {
            console.log('Token encontrado en hash, estableciendo sesión...');
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: hashParams.get('refresh_token') || ''
            });
            
            if (sessionError) {
              console.error('Error estableciendo sesión:', sessionError);
              setError(sessionError.message);
              setTimeout(() => navigate('/login'), 3000);
            } else {
              console.log('✅ Sesión establecida:', sessionData.user?.email);
              navigate('/dashboard', { replace: true });
            }
          } else {
            console.log('No hay token, redirigiendo a login');
            navigate('/login', { replace: true });
          }
        }
      } catch (err) {
        console.error('Error en callback:', err);
        setError('Error procesando autenticación');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
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
              <span className="text-2xl text-destructive">✕</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-destructive">Error de autenticación</h2>
              <p className="text-muted-foreground">{error}</p>
              <p className="text-muted-foreground text-sm">
                Redirigiendo al login...
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Iniciando sesión...</h2>
              <p className="text-muted-foreground">
                Por favor espera un momento
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;

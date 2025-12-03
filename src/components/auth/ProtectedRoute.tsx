import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      if (!user) {
        setCheckingOnboarding(false);
        return;
      }

      const { data } = await supabase
        .from('users')
        .select('onboarding_completed')
        .eq('id', user.id)
        .maybeSingle();

      setOnboardingCompleted(data?.onboarding_completed ?? false);
      setCheckingOnboarding(false);
    };

    if (user) {
      checkOnboarding();
    } else {
      setCheckingOnboarding(false);
    }
  }, [user]);

  if (loading || checkingOnboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If onboarding not completed and not on onboarding page, redirect to onboarding
  if (onboardingCompleted === false && !location.pathname.startsWith('/onboarding')) {
    return <Navigate to="/onboarding" replace />;
  }

  // If onboarding completed and on onboarding page, redirect to dashboard
  if (onboardingCompleted === true && location.pathname.startsWith('/onboarding')) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

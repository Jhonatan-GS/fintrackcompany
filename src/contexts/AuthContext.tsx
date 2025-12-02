import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: any; isNewUser?: boolean }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🔧 Using external Supabase project');
    console.log('🔧 Supabase configured:', isSupabaseConfigured());
    
    if (!isSupabaseConfigured()) {
      console.error('❌ CRITICAL: External Supabase is NOT configured!');
      toast.error("Error de configuración de Supabase");
    }
    
    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        console.log('✅ User authenticated:', session.user.email);
        console.log('👤 User ID:', session.user.id);
      }

      // Handle successful sign in
      if (event === "SIGNED_IN" && session) {
        setTimeout(() => {
          navigate("/dashboard");
        }, 0);
      }
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        console.log('✅ Existing session found:', session.user.email);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signInWithGoogle = async () => {
    try {
      console.log('=== SIGN IN WITH GOOGLE ===');
      console.log('Supabase configured:', isSupabaseConfigured());
      
      if (!isSupabaseConfigured()) {
        console.error('❌ Cannot sign in: Supabase not configured');
        toast.error("Error: Supabase no está configurado. Verifica las variables de entorno.");
        return;
      }
      
      const redirectUrl = `${window.location.origin}/auth/callback`;
      console.log('Redirect URL:', redirectUrl);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        console.error("❌ Error signing in with Google:", error);
        toast.error("Error al iniciar sesión con Google. Intenta de nuevo.");
      } else {
        console.log('✅ OAuth redirect initiated');
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Error inesperado. Por favor intenta de nuevo.");
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      // Primero intentar login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error && error.message.includes('Invalid login credentials')) {
        // Si no existe, crear cuenta automáticamente
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        });
        
        if (signUpError) {
          console.error("Error creating account:", signUpError);
          toast.error("Error al crear la cuenta. Intenta de nuevo.");
          return { error: signUpError };
        }
        
        console.log('✅ New account created:', email);
        toast.success("Cuenta creada exitosamente. Bienvenido!");
        return { error: null, isNewUser: true };
      }
      
      if (error) {
        console.error("Error signing in:", error);
        toast.error("Error al iniciar sesión. Verifica tus credenciales.");
        return { error };
      }
      
      console.log('✅ Signed in with email:', email);
      toast.success("Sesión iniciada exitosamente");
      return { error: null };
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Error inesperado. Por favor intenta de nuevo.");
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
        toast.error("Error al cerrar sesión");
      } else {
        toast.success("Sesión cerrada exitosamente");
        navigate("/");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Error inesperado al cerrar sesión");
    }
  };

  const value = {
    user,
    session,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

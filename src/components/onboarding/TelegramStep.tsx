import { useState, useEffect, useCallback } from "react";
import { Copy, ExternalLink, RefreshCw, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TelegramStepProps {
  userId: string;
  onComplete: () => void;
  onSkip: () => void;
  onBack: () => void;
}

export const TelegramStep = ({ userId, onComplete, onSkip, onBack }: TelegramStepProps) => {
  const [linkingCode, setLinkingCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [isLinked, setIsLinked] = useState(false);
  const [telegramUsername, setTelegramUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkIfLinked = useCallback(async () => {
    const { data } = await supabase
      .from('users')
      .select('telegram_chat_id, telegram_username')
      .eq('id', userId)
      .maybeSingle();

    if (data?.telegram_chat_id) {
      setIsLinked(true);
      setTelegramUsername(data.telegram_username);
      return true;
    }
    return false;
  }, [userId]);

  const generateCode = useCallback(async () => {
    setIsLoading(true);
    
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const { error } = await supabase
      .from('telegram_sessions')
      .upsert({
        user_id: userId,
        linking_code: code,
        linking_code_expires_at: expires.toISOString(),
        is_linked: false
      }, { onConflict: 'user_id' });

    if (!error) {
      setLinkingCode(code);
      setExpiresAt(expires);
    }
    setIsLoading(false);
  }, [userId]);

  useEffect(() => {
    const init = async () => {
      const linked = await checkIfLinked();
      if (!linked) {
        await generateCode();
      }
      setIsLoading(false);
    };
    init();
  }, [checkIfLinked, generateCode]);

  // Polling for link status
  useEffect(() => {
    if (isLinked || !linkingCode) return;

    const interval = setInterval(async () => {
      const { data } = await supabase
        .from('telegram_sessions')
        .select('is_linked')
        .eq('user_id', userId)
        .maybeSingle();

      if (data?.is_linked) {
        const { data: userData } = await supabase
          .from('users')
          .select('telegram_username')
          .eq('id', userId)
          .maybeSingle();

        setIsLinked(true);
        setTelegramUsername(userData?.telegram_username);
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [linkingCode, isLinked, userId]);

  // Countdown timer
  useEffect(() => {
    if (!expiresAt || isLinked) return;

    const interval = setInterval(() => {
      const remaining = expiresAt.getTime() - Date.now();
      if (remaining <= 0) {
        generateCode();
        return;
      }
      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, isLinked, generateCode]);

  const copyCode = () => {
    if (linkingCode) {
      navigator.clipboard.writeText(linkingCode);
      toast.success('Código copiado!');
    }
  };

  const openTelegram = () => {
    window.open(`https://t.me/FinTrackBot?start=${linkingCode}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isLinked) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">¡Telegram conectado!</h2>
          {telegramUsername && (
            <p className="text-primary font-medium">@{telegramUsername}</p>
          )}
          <p className="text-muted-foreground">
            Recibirás notificaciones de cada transacción
          </p>
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={onComplete}
            className="px-6 py-3 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
          >
            Continuar →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="text-4xl mb-4">📱</div>
        <h2 className="text-2xl font-bold text-foreground">Conecta tu Telegram</h2>
        <p className="text-muted-foreground">
          Recibe notificaciones instantáneas de cada transacción y confírmalas con un tap
        </p>
      </div>

      {/* Code display */}
      <div className="bg-card border border-border rounded-xl p-6 text-center space-y-4">
        <div className="bg-muted rounded-lg p-4">
          <span className="text-3xl font-mono font-bold text-foreground tracking-widest">
            {linkingCode}
          </span>
        </div>

        <button
          onClick={copyCode}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
        >
          <Copy className="w-4 h-4" />
          Copiar código
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          📌 Instrucciones
        </h3>
        <ol className="space-y-2 text-sm text-muted-foreground">
          <li>1. Abre Telegram</li>
          <li>2. Busca <span className="text-foreground font-medium">@FinTrackBot</span></li>
          <li>3. Envía: <span className="text-foreground font-mono">/start {linkingCode}</span></li>
        </ol>

        <button
          onClick={openTelegram}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#0088cc] text-primary-foreground hover:bg-[#0088cc]/90 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Abrir Telegram
        </button>
      </div>

      {/* Status */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-sm">Esperando vinculación...</span>
        </div>
        <div className="flex items-center justify-center gap-4 text-sm">
          <button
            onClick={generateCode}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Generar nuevo código
          </button>
          <span className="text-muted-foreground">
            Expira en: <span className="text-foreground">{timeRemaining}</span>
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Anterior
        </button>
        <button
          onClick={onSkip}
          className="px-6 py-3 rounded-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Omitir por ahora →
        </button>
      </div>
    </div>
  );
};

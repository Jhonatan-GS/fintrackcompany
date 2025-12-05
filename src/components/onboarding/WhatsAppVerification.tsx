import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Phone, MessageSquare, Check, Loader2, RefreshCw, ArrowLeft } from 'lucide-react';

type WhatsAppStep = 'INPUT_PHONE' | 'INPUT_CODE' | 'VERIFIED';

interface WhatsAppVerificationProps {
  userId: string;
  onComplete: () => void;
  onSkip: () => void;
  onBack: () => void;
}

export const WhatsAppVerification = ({ userId, onComplete, onSkip, onBack }: WhatsAppVerificationProps) => {
  const [step, setStep] = useState<WhatsAppStep>('INPUT_PHONE');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [error, setError] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState<string | null>(null);

  const fullPhoneNumber = `+57${phone}`;

  // Timer para reenvío
  useEffect(() => {
    if (step === 'INPUT_CODE' && resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
  }, [step, resendTimer]);

  // Formatear número
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.slice(0, 10);
  };

  // Generar código aleatorio de 6 dígitos
  const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Enviar código de verificación
  const sendVerificationCode = async () => {
    if (phone.length < 10) {
      setError('Ingresa un número de 10 dígitos');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const generatedCode = generateCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

      // Guardar verificación en la base de datos
      const { error: dbError } = await supabase
        .from('whatsapp_verifications')
        .upsert({
          user_id: userId,
          phone: fullPhoneNumber,
          verification_code: generatedCode,
          expires_at: expiresAt.toISOString(),
          attempts: 0,
          is_verified: false
        }, { onConflict: 'user_id' });

      if (dbError) throw dbError;

      setVerificationCode(generatedCode);

      // TODO: Llamar webhook de N8N para enviar WhatsApp
      console.log('=== CÓDIGO DE VERIFICACIÓN ===');
      console.log('Teléfono:', fullPhoneNumber);
      console.log('Código:', generatedCode);
      console.log('===============================');

      setStep('INPUT_CODE');
      setResendTimer(60);
      setCanResend(false);
      toast.success('¡Código generado! (Ver consola para testing)');

    } catch (err) {
      console.error('Error:', err);
      setError('Error generando código. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar código
  const verifyCode = async () => {
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      setError('Ingresa el código de 6 dígitos');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Obtener verificación actual
      const { data: verification, error: fetchError } = await supabase
        .from('whatsapp_verifications')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!verification) {
        setError('No hay código pendiente. Solicita uno nuevo.');
        setCanResend(true);
        setIsLoading(false);
        return;
      }

      // Verificar expiración
      if (new Date(verification.expires_at) < new Date()) {
        setError('Código expirado. Solicita uno nuevo.');
        setCanResend(true);
        setIsLoading(false);
        return;
      }

      // Verificar intentos
      if (verification.attempts >= 3) {
        setError('Demasiados intentos. Solicita un nuevo código.');
        setCanResend(true);
        setIsLoading(false);
        return;
      }

      // Verificar código
      if (verification.verification_code === fullCode) {
        // Marcar como verificado
        await supabase
          .from('whatsapp_verifications')
          .update({ is_verified: true })
          .eq('user_id', userId);

        // Actualizar usuario con el teléfono
        await supabase
          .from('users')
          .update({ whatsapp_phone: fullPhoneNumber })
          .eq('id', userId);

        setStep('VERIFIED');
        toast.success('¡WhatsApp verificado!');
        setTimeout(() => onComplete(), 1500);
      } else {
        // Incrementar intentos
        const newAttempts = verification.attempts + 1;
        await supabase
          .from('whatsapp_verifications')
          .update({ attempts: newAttempts })
          .eq('user_id', userId);

        const remaining = 3 - newAttempts;
        if (remaining > 0) {
          setError(`Código incorrecto. ${remaining} intento${remaining > 1 ? 's' : ''} restante${remaining > 1 ? 's' : ''}.`);
        } else {
          setError('Demasiados intentos. Solicita un nuevo código.');
          setCanResend(true);
        }
        setCode(['', '', '', '', '', '']);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error verificando código');
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar input del código
  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Manejar backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
    if (e.key === 'Enter' && code.join('').length === 6) {
      verifyCode();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-[#25D366]/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-8 h-8 text-[#25D366]" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Conecta tu WhatsApp</h2>
        <p className="text-muted-foreground mt-2">
          Recibe notificaciones instantáneas de cada transacción
        </p>
      </div>

      {/* Step: INPUT_PHONE */}
      {step === 'INPUT_PHONE' && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <label className="block text-sm font-medium text-muted-foreground mb-3">
              Número de WhatsApp
            </label>
            <div className="flex gap-2">
              <div className="flex items-center bg-muted rounded-lg px-4 py-3 text-foreground">
                <span className="text-lg mr-2">🇨🇴</span>
                <span className="font-medium">+57</span>
              </div>
              <Input
                type="tel"
                placeholder="311 234 5678"
                value={phone}
                onChange={(e) => {
                  setPhone(formatPhone(e.target.value));
                  setError(null);
                }}
                className="flex-1 bg-muted border-none text-foreground text-lg h-12"
                maxLength={10}
              />
            </div>
            {error && (
              <p className="text-destructive text-sm mt-3">{error}</p>
            )}
          </div>

          <Button
            onClick={sendVerificationCode}
            disabled={phone.length < 10 || isLoading}
            className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white py-6 text-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Phone className="w-5 h-5 mr-2" />
                Enviar código de verificación
              </>
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Te enviaremos un código de 6 dígitos por WhatsApp
          </p>

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <button
              onClick={onBack}
              className="flex items-center gap-1 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Anterior
            </button>
            <button
              onClick={onSkip}
              className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              Omitir por ahora →
            </button>
          </div>
        </div>
      )}

      {/* Step: INPUT_CODE */}
      {step === 'INPUT_CODE' && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-center text-muted-foreground mb-2">
              Ingresa el código enviado a
            </p>
            <p className="text-center text-foreground font-medium text-lg mb-6">
              {fullPhoneNumber}
            </p>

            {/* DEBUG: Mostrar código para testing */}
            {verificationCode && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-4">
                <p className="text-yellow-400 text-xs text-center">
                  🔧 DEBUG (quitar en producción)
                </p>
                <p className="text-yellow-300 text-center font-mono text-2xl">
                  {verificationCode}
                </p>
              </div>
            )}

            {/* Inputs del código */}
            <div className="flex justify-center gap-2 mb-4">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-bold bg-muted border-2 border-border rounded-lg text-foreground focus:border-[#25D366] focus:outline-none transition-colors"
                />
              ))}
            </div>

            {error && (
              <p className="text-destructive text-sm text-center mb-4">{error}</p>
            )}

            {/* Reenviar código */}
            <div className="text-center">
              {canResend ? (
                <button
                  onClick={() => {
                    setCode(['', '', '', '', '', '']);
                    setError(null);
                    sendVerificationCode();
                  }}
                  className="text-[#25D366] hover:text-[#25D366]/80 text-sm flex items-center justify-center mx-auto"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Reenviar código
                </button>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Reenviar código en <span className="text-foreground font-mono">{resendTimer}s</span>
                </p>
              )}
            </div>
          </div>

          <Button
            onClick={verifyCode}
            disabled={code.join('').length !== 6 || isLoading}
            className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white py-6 text-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                <Check className="w-5 h-5 mr-2" />
                Verificar código
              </>
            )}
          </Button>

          <button
            onClick={() => {
              setStep('INPUT_PHONE');
              setCode(['', '', '', '', '', '']);
              setError(null);
            }}
            className="w-full text-muted-foreground hover:text-foreground text-sm py-2"
          >
            ← Cambiar número
          </button>
        </div>
      )}

      {/* Step: VERIFIED */}
      {step === 'VERIFIED' && (
        <div className="bg-card border border-[#25D366]/30 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-[#25D366]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-[#25D366]" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">¡WhatsApp verificado!</h3>
          <p className="text-foreground font-medium text-lg">
            {fullPhoneNumber}
          </p>
          <p className="text-muted-foreground text-sm mt-3">
            Recibirás notificaciones de tus transacciones en este número
          </p>
        </div>
      )}
    </div>
  );
};

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Phone, MessageSquare, Check, Loader2, ArrowLeft } from 'lucide-react';

type WhatsAppStep = 'INPUT_PHONE' | 'WAITING_CODE' | 'VERIFIED';

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
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fullPhoneNumber = `+57${phone}`;

  // Formatear número
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.slice(0, 10);
  };

  // Crear verificación en la base de datos
  const createVerification = async () => {
    if (phone.length < 10) {
      setError('Ingresa un número de 10 dígitos');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Llamar a la función RPC para crear la verificación
      const { data, error: rpcError } = await supabase.rpc('create_whatsapp_verification', {
        p_user_id: userId,
        p_phone: fullPhoneNumber
      });

      if (rpcError) throw rpcError;

      setStep('WAITING_CODE');
      toast.success('¡Número registrado! Abre WhatsApp para recibir tu código.');

    } catch (err) {
      console.error('Error:', err);
      setError('Error registrando número. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar código usando RPC
  const handleVerifyCode = async () => {
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      setError('Ingresa el código de 6 dígitos');
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const { data, error: rpcError } = await supabase.rpc('verify_whatsapp_code', {
        p_user_id: userId,
        p_code: fullCode
      });

      if (rpcError) throw rpcError;

      if (data?.success) {
        setStep('VERIFIED');
        toast.success('¡WhatsApp verificado!');
        setTimeout(() => onComplete(), 2000);
      } else {
        const errorMsg = data?.error || 'Código incorrecto';
        if (data?.attempts_remaining !== undefined && data.attempts_remaining > 0) {
          setError(`Código incorrecto. Te quedan ${data.attempts_remaining} intentos.`);
        } else if (data?.attempts_remaining === 0) {
          setError('Demasiados intentos. Solicita un nuevo código.');
        } else {
          setError(errorMsg);
        }
        setCode(['', '', '', '', '', '']);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al verificar. Intenta de nuevo.');
    } finally {
      setIsVerifying(false);
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
      handleVerifyCode();
    }
  };

  // URL de WhatsApp con mensaje pre-escrito
  const whatsappUrl = "https://wa.me/12062381442?text=Hola%20FinTrack%2C%20autenticame";

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
            onClick={createVerification}
            disabled={phone.length < 10 || isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Registrando...
              </>
            ) : (
              <>
                <Phone className="w-5 h-5 mr-2" />
                Continuar
              </>
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Recibirás un código de verificación por WhatsApp
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

      {/* Step: WAITING_CODE */}
      {step === 'WAITING_CODE' && (
        <div className="text-center space-y-6">
          {/* Instrucciones */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Verifica tu WhatsApp
            </h3>
            <p className="text-muted-foreground mb-4">
              Haz click en el botón para abrir WhatsApp y enviar el mensaje. 
              Recibirás tu código de verificación automáticamente.
            </p>
            
            {/* Número ingresado */}
            <div className="bg-background rounded-lg p-3 mb-4">
              <p className="text-muted-foreground text-sm">Tu número</p>
              <p className="text-foreground font-mono text-lg">{fullPhoneNumber}</p>
            </div>
            
            {/* Botón Abrir WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 w-full bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold py-4 px-6 rounded-xl transition-colors"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Abrir WhatsApp
            </a>
            
            <p className="text-muted-foreground text-sm mt-3">
              El mensaje se escribirá automáticamente, solo debes enviarlo.
            </p>
          </div>
          
          {/* Separador */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-muted-foreground text-sm">¿Ya recibiste el código?</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>
          
          {/* Input de código */}
          <div className="space-y-4">
            <p className="text-muted-foreground">Ingresa el código de 6 dígitos:</p>
            
            {/* 6 inputs para el código */}
            <div className="flex justify-center gap-2">
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
              <p className="text-destructive text-sm text-center">{error}</p>
            )}
            
            {/* Botón verificar */}
            <Button
              onClick={handleVerifyCode}
              disabled={code.join('').length !== 6 || isVerifying}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg"
            >
              {isVerifying ? (
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
            
            {/* Cambiar número */}
            <button
              onClick={() => {
                setStep('INPUT_PHONE');
                setCode(['', '', '', '', '', '']);
                setError(null);
              }}
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              ← Cambiar número de teléfono
            </button>
          </div>
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

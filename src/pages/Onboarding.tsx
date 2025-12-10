import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { OnboardingStepper } from "@/components/onboarding/OnboardingStepper";
import { BankSelectionStep } from "@/components/onboarding/BankSelectionStep";
import { WhatsAppVerification } from "@/components/onboarding/WhatsAppVerification";
import { CategoriesStep } from "@/components/onboarding/CategoriesStep";
import { Loader2 } from "lucide-react";

const STEPS = [
  { number: 1, title: 'Bancos', description: 'Selecciona los bancos que usas' },
  { number: 2, title: 'WhatsApp', description: 'Conecta para recibir notificaciones' },
  { number: 3, title: 'Categorías', description: 'Personaliza tus categorías' }
];

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [selectedBanks, setSelectedBanks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load onboarding state from DB on mount
  useEffect(() => {
    const loadOnboardingState = async () => {
      if (!user) return;
      
      try {
        const { data: userData, error } = await supabase
          .from('users')
          .select('onboarding_step, onboarding_completed')
          .eq('id', user.id)
          .maybeSingle();
        
        if (error) throw error;
        
        if (userData?.onboarding_completed) {
          navigate('/dashboard', { replace: true });
          return;
        }
        
        if (userData?.onboarding_step !== null && userData?.onboarding_step !== undefined) {
          // onboarding_step represents the LAST completed step
          // So we need to go to the NEXT step (step + 1), but cap at 3
          const nextStep = Math.min(userData.onboarding_step + 1, 3);
          setCurrentStep(nextStep);
          
          // Mark previous steps as completed
          const completed = [];
          for (let i = 1; i < nextStep; i++) {
            completed.push(i);
          }
          setCompletedSteps(completed);
        }
      } catch (err) {
        console.error('Error loading onboarding state:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadOnboardingState();
  }, [user, navigate]);

  const markStepComplete = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
  };

  const handleBanksComplete = async (selectedIds: string[]) => {
    if (!user) return;

    // Save selected banks to user_providers
    await supabase
      .from('user_providers')
      .delete()
      .eq('user_id', user.id);

    if (selectedIds.length > 0) {
      const inserts = selectedIds.map(providerId => ({
        user_id: user.id,
        provider_id: providerId,
        is_active: true
      }));

      await supabase
        .from('user_providers')
        .insert(inserts);
    }

    // Update onboarding step
    await supabase
      .from('users')
      .update({ onboarding_step: 1 })
      .eq('id', user.id);

    markStepComplete(1);
    setCurrentStep(2);
  };

  const handleWhatsAppComplete = async () => {
    if (!user) return;

    await supabase
      .from('users')
      .update({ onboarding_step: 2 })
      .eq('id', user.id);

    markStepComplete(2);
    setCurrentStep(3);
  };

  const handleWhatsAppSkip = async () => {
    if (!user) return;

    await supabase
      .from('users')
      .update({ onboarding_step: 2 })
      .eq('id', user.id);

    // Don't mark as completed since it was skipped
    setCurrentStep(3);
  };

  const handleCategoriesComplete = async () => {
    if (!user) return;

    await supabase
      .from('users')
      .update({ 
        onboarding_completed: true,
        onboarding_step: 3 
      })
      .eq('id', user.id);

    markStepComplete(3);
    toast.success('¡Bienvenido a FinTrack! 🎉');
    navigate('/dashboard', { replace: true });
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with Logo */}
      <header className="py-6 px-4">
        <div className="flex items-center justify-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">F</span>
          </div>
          <span className="text-xl font-bold text-foreground">FinTrack</span>
        </div>
      </header>

      {/* Stepper */}
      <div className="px-4 py-6">
        <OnboardingStepper 
          steps={STEPS} 
          currentStep={currentStep} 
          completedSteps={completedSteps} 
        />
      </div>

      {/* Content */}
      <main className="flex-1 px-4 pb-8">
        <div className="max-w-2xl mx-auto bg-card/50 border border-border rounded-2xl p-6 sm:p-8">
          {currentStep === 1 && (
            <BankSelectionStep
              userId={user.id}
              onComplete={handleBanksComplete}
              selectedBanks={selectedBanks}
              setSelectedBanks={setSelectedBanks}
            />
          )}

          {currentStep === 2 && (
            <WhatsAppVerification
              userId={user.id}
              onComplete={handleWhatsAppComplete}
              onSkip={handleWhatsAppSkip}
              onBack={goToPreviousStep}
            />
          )}

          {currentStep === 3 && (
            <CategoriesStep
              userId={user.id}
              onComplete={handleCategoriesComplete}
              onBack={goToPreviousStep}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Onboarding;

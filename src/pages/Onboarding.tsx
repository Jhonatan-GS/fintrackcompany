import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { OnboardingStepper } from "@/components/onboarding/OnboardingStepper";
import { BankSelectionStep } from "@/components/onboarding/BankSelectionStep";
import { TelegramStep } from "@/components/onboarding/TelegramStep";
import { CategoriesStep } from "@/components/onboarding/CategoriesStep";

const STEPS = [
  { number: 1, title: 'Bancos', description: 'Selecciona los bancos que usas' },
  { number: 2, title: 'Telegram', description: 'Conecta para recibir notificaciones' },
  { number: 3, title: 'Categorías', description: 'Personaliza tus categorías' }
];

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [selectedBanks, setSelectedBanks] = useState<string[]>([]);

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

  const handleTelegramComplete = async () => {
    if (!user) return;

    await supabase
      .from('users')
      .update({ onboarding_step: 2 })
      .eq('id', user.id);

    markStepComplete(2);
    setCurrentStep(3);
  };

  const handleTelegramSkip = async () => {
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
            <TelegramStep
              userId={user.id}
              onComplete={handleTelegramComplete}
              onSkip={handleTelegramSkip}
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

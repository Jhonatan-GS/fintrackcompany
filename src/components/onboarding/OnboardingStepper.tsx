import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  number: number;
  title: string;
  description: string;
}

interface OnboardingStepperProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
}

export const OnboardingStepper = ({ steps, currentStep, completedSteps }: OnboardingStepperProps) => {
  return (
    <div className="flex items-center justify-center w-full max-w-md mx-auto">
      {steps.map((step, index) => {
        const isActive = step.number === currentStep;
        const isCompleted = completedSteps.includes(step.number);
        const isLast = index === steps.length - 1;

        return (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              {/* Circle */}
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
                  isCompleted && "bg-primary text-primary-foreground",
                  isActive && !isCompleted && "bg-primary text-primary-foreground ring-4 ring-primary/30",
                  !isActive && !isCompleted && "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : step.number}
              </div>
              {/* Label */}
              <span
                className={cn(
                  "mt-2 text-xs font-medium transition-colors",
                  isActive || isCompleted ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.title}
              </span>
            </div>

            {/* Connector line */}
            {!isLast && (
              <div
                className={cn(
                  "w-16 sm:w-24 h-0.5 mx-2 transition-colors",
                  isCompleted ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

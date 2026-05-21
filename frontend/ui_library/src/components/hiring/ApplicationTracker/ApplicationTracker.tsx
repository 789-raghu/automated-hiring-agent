import React from 'react';
import {Check, X} from 'lucide-react';
import './ApplicationTracker.css';

export interface ApplicationStep {
  key: string;
  label: string;
  description?: string;
  completedAt?: string;
}

export type StepState = 'completed' | 'active' | 'pending' | 'failed';

export interface ApplicationTrackerProps {
  steps: ApplicationStep[];
  currentStep: string;
  failedStep?: string;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

function getStepState(
  step: ApplicationStep,
  steps: ApplicationStep[],
  currentStep: string,
  failedStep?: string
): StepState {
  if (step.key === failedStep) return 'failed';
  const currentIdx = steps.findIndex((s) => s.key === currentStep);
  const stepIdx = steps.findIndex((s) => s.key === step.key);
  if (stepIdx < currentIdx) return 'completed';
  if (stepIdx === currentIdx) return 'active';
  return 'pending';
}

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  steps,
  currentStep,
  failedStep,
  orientation = 'horizontal',
  className = '',
}) => (
  <div className={`app-tracker app-tracker--${orientation} ${className}`}>
    {steps.map((step, i) => {
      const state = getStepState(step, steps, currentStep, failedStep);
      const isLast = i === steps.length - 1;
      return (
        <React.Fragment key={step.key}>
          <div className={`app-tracker__step app-tracker__step--${state}`}>
            <div className="app-tracker__circle">
              {state === 'completed' && <Check size={12}/>}
              {state === 'failed' && <X size={12} />}
              {(state === 'active' || state === 'pending') && (
                <span className="app-tracker__num">{i + 1}</span>
              )}
            </div>
            <div className="app-tracker__info">
              <span className="app-tracker__label">{step.label}</span>
              {step.description && (
                <span className="app-tracker__desc">{step.description}</span>
              )}
              {step.completedAt && state === 'completed' && (
                <span className="app-tracker__date">{step.completedAt}</span>
              )}
            </div>
          </div>
          {!isLast && <div className={`app-tracker__line app-tracker__line--${state === 'completed' ? 'done' : 'pending'}`} />}
        </React.Fragment>
      );
    })}
  </div>
);

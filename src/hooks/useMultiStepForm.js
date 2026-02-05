import { useMemo, useState } from 'react';
import { validateStepData } from '../utils/validators';

const createEmptyStep = () => ({
  profilePhoto: null,
  firstName: '',
  email: '',
  paternalLastName: '',
  maternalLastName: '',
  birthDay: '',
  birthMonth: '',
  birthYear: '',
  gender: '',
  phone: '',
});

const initialFormData = {
  step1: createEmptyStep(),
  step2: createEmptyStep(),
  step3: createEmptyStep(),
};

export function useMultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [errorsByStep, setErrorsByStep] = useState({ step1: {}, step2: {}, step3: {} });

  const totalSteps = 4;
  const isThankYouStep = currentStep === 4;
  const activeStepKey = `step${Math.min(currentStep, 3)}`;

  const validateCurrentStep = () => {
    const validationErrors = validateStepData(formData[activeStepKey]);
    setErrorsByStep((prev) => ({ ...prev, [activeStepKey]: validationErrors }));
    return validationErrors;
  };

  const currentStepErrors = errorsByStep[activeStepKey] || {};

  const isCurrentStepValid = useMemo(() => {
    if (isThankYouStep) return true;
    return Object.keys(validateStepData(formData[activeStepKey])).length === 0;
  }, [formData, activeStepKey, isThankYouStep]);

  const updateField = (stepKey, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [stepKey]: {
        ...prev[stepKey],
        [field]: value,
      },
    }));

    setErrorsByStep((prev) => {
      const nextErrors = { ...prev };
      if (nextErrors[stepKey]?.[field]) {
        const freshErrors = validateStepData({
          ...formData[stepKey],
          [field]: value,
        });
        nextErrors[stepKey] = freshErrors;
      }
      return nextErrors;
    });
  };

  const goNext = () => {
    if (currentStep >= 3) return;
    const errors = validateCurrentStep();
    if (Object.keys(errors).length > 0) return;
    setCurrentStep((prev) => prev + 1);
  };

  const goPrev = () => setCurrentStep((prev) => Math.max(1, prev - 1));

  const showThankYou = () => setCurrentStep(4);

  const resetAll = () => {
    setFormData(initialFormData);
    setErrorsByStep({ step1: {}, step2: {}, step3: {} });
    setCurrentStep(1);
  };

  return {
    currentStep,
    totalSteps,
    isThankYouStep,
    formData,
    activeStepKey,
    currentStepErrors,
    isCurrentStepValid,
    updateField,
    goNext,
    goPrev,
    validateCurrentStep,
    showThankYou,
    resetAll,
  };
}

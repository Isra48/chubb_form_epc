import { useMemo, useState } from 'react';
import { validateStepData } from '../utils/validators';

const createStep1 = () => ({
  profilePhotoBase64: '',
  profilePhotoName: '',
  firstName: '',
  paternalLastName: '',
  maternalLastName: '',
  email: '',
  birthDay: '',
  birthMonth: '',
  birthYear: '',
  gender: '',
  flightCity: '',
  phoneLandline: '',
  phoneMobile: '',
  shirtSize: '',
});

const createStep2 = () => ({
  agentKey: '',
  officeName: '',
  officeRfc: '',
  zone: '',
});

const createStep3 = () => ({
  hasAllergies: '',
  allergiesDetails: '',
  hasMedicalCondition: '',
  medicalDetails: '',
  hasDiet: '',
  dietDetails: '',
});

const createStep4 = () => ({
  emergencyContactName: '',
  emergencyRelationship: '',
  emergencyPhone: '',
});

const initialFormData = {
  step1: createStep1(),
  step2: createStep2(),
  step3: createStep3(),
  step4: createStep4(),
};

export function useMultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [errorsByStep, setErrorsByStep] = useState({
    step1: {},
    step2: {},
    step3: {},
    step4: {},
  });

  const totalSteps = 5;
  const isThankYouStep = currentStep === 5;
  const activeStepKey = `step${Math.min(currentStep, 4)}`;

  const validateCurrentStep = () => {
    const validationErrors = validateStepData(activeStepKey, formData[activeStepKey]);
    setErrorsByStep((prev) => ({ ...prev, [activeStepKey]: validationErrors }));
    return validationErrors;
  };

  const currentStepErrors = errorsByStep[activeStepKey] || {};

  const isCurrentStepValid = useMemo(() => {
    if (isThankYouStep) return true;
    return Object.keys(validateStepData(activeStepKey, formData[activeStepKey])).length === 0;
  }, [formData, activeStepKey, isThankYouStep]);

  const liveValidateFields = new Set(['email', 'phoneLandline', 'phoneMobile', 'emergencyPhone']);

  const updateField = (stepKey, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [stepKey]: {
        ...prev[stepKey],
        [field]: value,
      },
    }));

    setErrorsByStep((prev) => {
      const prevStepErrors = prev[stepKey] || {};
      const nextStepData = { ...formData[stepKey], [field]: value };

      if (liveValidateFields.has(field)) {
        const freshErrors = validateStepData(stepKey, nextStepData);
        const nextStepErrors = { ...prevStepErrors };

        if (freshErrors[field]) {
          nextStepErrors[field] = freshErrors[field];
        } else {
          delete nextStepErrors[field];
        }

        return { ...prev, [stepKey]: nextStepErrors };
      }

      if (Object.keys(prevStepErrors).length === 0) {
        return prev;
      }

      const freshErrors = validateStepData(stepKey, nextStepData);
      return { ...prev, [stepKey]: freshErrors };
    });
  };

  const goNext = () => {
    if (currentStep >= 4) return;
    const errors = validateCurrentStep();
    if (Object.keys(errors).length > 0) return;
    setCurrentStep((prev) => prev + 1);
  };

  const goPrev = () => setCurrentStep((prev) => Math.max(1, prev - 1));

  const showThankYou = () => setCurrentStep(5);

  const resetAll = () => {
    setFormData(initialFormData);
    setErrorsByStep({ step1: {}, step2: {}, step3: {}, step4: {} });
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

import { useMemo, useState } from 'react';
import { validateStepData } from '../utils/validators';

const createStep1 = () => ({
  profilePhotoBase64: '',
  profilePhotoName: '',
  badgeName: '',
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
  hasRelevantCondition: '',
  relevantConditionDetails: '',
  takesMedication: '',
  medicationDetails: '',
  hasDiet: '',
  dietDetails: '',
});

const createStep4 = () => ({
  policyFullName: '',
  policyGender: '',
  policyBirthDay: '',
  policyBirthMonth: '',
  policyBirthYear: '',
  policyIne: '',
  policyCurp: '',
  policyBeneficiaryName: '',
  policyBeneficiaryRelationship: '',
});

const createStep5 = () => ({
  emergencyContactName: '',
  emergencyRelationship: '',
  emergencyPhone: '',
});

const initialFormData = {
  step1: createStep1(),
  step2: createStep2(),
  step3: createStep3(),
  step4: createStep4(),
  step5: createStep5(),
};

export function useMultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [errorsByStep, setErrorsByStep] = useState({
    step1: {},
    step2: {},
    step3: {},
    step4: {},
    step5: {},
  });
  const [touchedByStep, setTouchedByStep] = useState({
    step1: {},
    step2: {},
    step3: {},
    step4: {},
    step5: {},
  });

  const totalSteps = 6;
  const isThankYouStep = currentStep === totalSteps;
  const activeStepKey = `step${Math.min(currentStep, 5)}`;

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
      const hasTouchedFields = Object.keys(touchedByStep[stepKey] || {}).length > 0;
      const shouldValidate =
        hasTouchedFields || liveValidateFields.has(field) || Object.keys(prevStepErrors).length > 0;

      if (!shouldValidate) {
        return prev;
      }

      const freshErrors = validateStepData(stepKey, nextStepData);
      return { ...prev, [stepKey]: freshErrors };
    });
  };

  const markTouched = (stepKey, field) => {
    setTouchedByStep((prev) => ({
      ...prev,
      [stepKey]: { ...prev[stepKey], [field]: true },
    }));

    setErrorsByStep((prev) => ({
      ...prev,
      [stepKey]: validateStepData(stepKey, formData[stepKey]),
    }));
  };

  const goNext = () => {
    if (currentStep >= 5) return;
    const errors = validateCurrentStep();
    if (Object.keys(errors).length > 0) return;
    setCurrentStep((prev) => prev + 1);
  };

  const goPrev = () => setCurrentStep((prev) => Math.max(1, prev - 1));

  const showThankYou = () => setCurrentStep(6);

  const resetAll = () => {
    setFormData(initialFormData);
    setErrorsByStep({ step1: {}, step2: {}, step3: {}, step4: {}, step5: {} });
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
    markTouched,
    goNext,
    goPrev,
    validateCurrentStep,
    showThankYou,
    resetAll,
    touchedByStep,
  };
}

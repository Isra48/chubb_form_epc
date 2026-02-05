import { useEffect, useMemo, useState } from 'react';
import FormStepFields from './components/FormStepFields';
import FormStatusMessage from './components/FormStatusMessage';
import StepPaginationControls from './components/StepPaginationControls';
import StepperProgressBar from './components/StepperProgressBar';
import ThankYouStepView from './components/ThankYouStepView';
import { useMultiStepForm } from './hooks/useMultiStepForm';
import GraphicPanel from './layout/GraphicPanel';
import SplitLayout from './layout/SplitLayout';
import { submitForm } from './services/googleSheetsService';

const STEP_COPY = {
  step1: {
    title: 'Datos personales',
    description: 'Comencemos con tus datos principales.',
  },
  step2: {
    title: 'Detalles adicionales',
    description: 'Este paso es un placeholder para la siguiente fase.',
  },
  step3: {
    title: 'Revision final',
    description: 'Verifica la informacion antes de enviar.',
  },
};

function buildPayload(formData) {
  return {
    submittedAt: new Date().toISOString(),
    step1: { ...formData.step1 },
    step2: { ...formData.step2 },
    step3: { ...formData.step3 },
  };
}

function App() {
  const {
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
  } = useMultiStepForm();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    setSubmitMessage('');
  }, [currentStep]);

  const handleSubmit = async () => {
    const errors = validateCurrentStep();

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    const payload = buildPayload(formData);
    const result = await submitForm(payload);

    setIsSubmitting(false);

    if (result.ok) {
      showThankYou();
      return;
    }

    const isCorsLike = Boolean(result.error?.isCorsLike);
    if (!isCorsLike) {
      setSubmitMessage(result.error?.message || 'No fue posible enviar la informacion.');
    }
  };

  const stepContent = STEP_COPY[activeStepKey];

  const summary = useMemo(() => {
    const firstName = formData.step1.firstName?.trim();
    const paternal = formData.step1.paternalLastName?.trim();
    const maternal = formData.step1.maternalLastName?.trim();
    const name = [firstName, paternal, maternal].filter(Boolean).join(' ');

    return {
      name,
      email: formData.step1.email?.trim(),
    };
  }, [formData]);

  const statusMessage = isSubmitting
    ? { type: 'loading', text: 'Enviando tu informacion...' }
    : submitMessage
      ? { type: 'error', text: submitMessage }
      : null;

  return (
    <SplitLayout
      graphic={<GraphicPanel />}
      form={
        <div className="form-shell">
          <header className="form-header">
            <p className="form-eyebrow">Registro EPC</p>
            <h1 className="form-title">Formulario guiado</h1>
            <p className="form-subtitle">Completa el registro en pocos pasos.</p>
          </header>

          <StepperProgressBar currentStep={currentStep} totalSteps={totalSteps} />

          <div className="form-body" role="region" aria-live="polite">
            {isThankYouStep ? (
              <ThankYouStepView summary={summary} onReset={resetAll} />
            ) : (
              <div className="step-content">
                <div>
                  <h2 className="step-title">{stepContent?.title || `Paso ${currentStep}`}</h2>
                  <p className="step-description">{stepContent?.description}</p>
                </div>
                <FormStepFields
                  stepKey={activeStepKey}
                  values={formData[activeStepKey]}
                  errors={currentStepErrors}
                  onFieldChange={updateField}
                />
              </div>
            )}

            {!isThankYouStep && statusMessage ? (
              <FormStatusMessage type={statusMessage.type} message={statusMessage.text} />
            ) : null}
          </div>

          {!isThankYouStep ? (
            <StepPaginationControls
              currentStep={currentStep}
              totalSteps={totalSteps}
              isLoading={isSubmitting}
              canGoNext={isCurrentStepValid}
              onPrev={goPrev}
              onNext={goNext}
              onSubmit={handleSubmit}
            />
          ) : null}
        </div>
      }
    />
  );
}

export default App;

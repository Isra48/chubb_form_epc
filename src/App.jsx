import { useState } from 'react';
import FormStepFields from './components/FormStepFields';
import StepPaginationControls from './components/StepPaginationControls';
import StepperProgressBar from './components/StepperProgressBar';
import ThankYouStepView from './components/ThankYouStepView';
import { useMultiStepForm } from './hooks/useMultiStepForm';
import { submitForm } from './services/googleSheetsService';

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
      setSubmitMessage(result.error?.message || 'No fue posible enviar la información.');
    }
  };

  return (
    <main className="app-shell">
      <section className="form-card">
        <h1>Registro multi-step</h1>

        <StepperProgressBar currentStep={currentStep} totalSteps={totalSteps} />

        <div className="step-content" role="region" aria-live="polite">
          {isThankYouStep ? (
            <ThankYouStepView email={formData.step1.email} onReset={resetAll} />
          ) : (
            <>
              <h2>Step {currentStep}</h2>
              <FormStepFields
                stepKey={activeStepKey}
                values={formData[activeStepKey]}
                errors={currentStepErrors}
                onFieldChange={updateField}
              />
              {submitMessage ? <p className="submit-error">{submitMessage}</p> : null}
            </>
          )}
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
      </section>
    </main>
  );
}

export default App;

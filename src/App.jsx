import { useState } from 'react';
import FormStepFields from './components/FormStepFields';
import StepPaginationControls from './components/StepPaginationControls';
import StepperProgressBar from './components/StepperProgressBar';
import ThankYouStepView from './components/ThankYouStepView';
import { useMultiStepForm } from './hooks/useMultiStepForm';
import SplitScreenLayout from './layout/SplitScreenLayout';
import { submitForm } from './services/googleSheetsService';
import visualAsset from './assets/form-visual.svg';

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
    if (Object.keys(errors).length > 0) return;

    setSubmitMessage('Enviando información...');
    setIsSubmitting(true);

    const result = await submitForm(buildPayload(formData));

    setIsSubmitting(false);

    if (result.ok) {
      setSubmitMessage('');
      showThankYou();
      return;
    }

    if (!result.error?.isCorsLike) {
      setSubmitMessage(result.error?.message || 'No se pudo completar el envío. Intenta de nuevo.');
    } else {
      setSubmitMessage('');
    }
  };

  const rightPanel = (
    <article className="form-panel">
      <header className="form-panel__header">
        <h1>Registro de contacto</h1>
        <p>Completa cada paso para finalizar tu registro.</p>
      </header>

      <StepperProgressBar currentStep={currentStep} totalSteps={totalSteps} />

      <div className="form-panel__content" role="region" aria-live="polite">
        {isThankYouStep ? (
          <ThankYouStepView email={formData.step1.email} onReset={resetAll} />
        ) : (
          <>
            <h2 className="step-title">Paso {currentStep}</h2>
            <FormStepFields
              stepKey={activeStepKey}
              values={formData[activeStepKey]}
              errors={currentStepErrors}
              onFieldChange={updateField}
            />
            {submitMessage ? (
              <p className={isSubmitting ? 'status status--loading' : 'status status--error'}>{submitMessage}</p>
            ) : null}
          </>
        )}
      </div>

      {!isThankYouStep ? (
        <footer className="form-panel__footer">
          <StepPaginationControls
            currentStep={currentStep}
            totalSteps={totalSteps}
            isLoading={isSubmitting}
            canGoNext={isCurrentStepValid}
            onPrev={goPrev}
            onNext={goNext}
            onSubmit={handleSubmit}
          />
        </footer>
      ) : null}
    </article>
  );

  const leftPanel = <img src={visualAsset} alt="Ilustración decorativa de formulario" className="visual-image" />;

  return <SplitScreenLayout left={leftPanel} right={rightPanel} />;
}

export default App;

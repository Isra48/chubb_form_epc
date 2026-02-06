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
    title: 'Datos generales',
    description: 'Completa la información principal del registro.',
  },
  step2: {
    title: 'Información de identificación del agente y del despacho',
    description: 'Ayúdanos a identificar tu zona y despacho.',
  },
  step3: {
    title: 'Información médica y alimentaria',
    description: 'Comparte datos relevantes para tu atención.',
  },
  step4: {
    title: 'Información de contacto de emergencia',
    description: 'Necesitamos un contacto de respaldo.',
  },
};

function sanitizeStep(stepData) {
  const { profilePhoto, ...rest } = stepData;
  return rest;
}

function buildPayload(formData) {
  return {
    submittedAt: new Date().toISOString(),
    step1: sanitizeStep(formData.step1),
    step2: sanitizeStep(formData.step2),
    step3: sanitizeStep(formData.step3),
    step4: sanitizeStep(formData.step4),
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

  const [attendanceState, setAttendanceState] = useState('pending');
  const [attendanceReady, setAttendanceReady] = useState(false);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    setSubmitMessage('');
  }, [currentStep]);

  useEffect(() => {
    if (attendanceState !== 'yes') return undefined;

    setAttendanceLoading(true);
    setAttendanceReady(false);

    const timer = setTimeout(() => {
      setAttendanceLoading(false);
      setAttendanceReady(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [attendanceState]);

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
    ? { type: 'loading', text: 'Enviando tu información...' }
    : submitMessage
      ? { type: 'error', text: submitMessage }
      : null;

  const showFormSteps = attendanceReady;
  const showAttendanceGate = !attendanceReady && !isThankYouStep;

  const handleAttendanceYes = () => {
    if (attendanceLoading) return;
    setAttendanceState('yes');
  };

  const handleAttendanceNo = () => {
    setAttendanceState('no');
    setAttendanceReady(false);
  };

  const handleResetAll = () => {
    resetAll();
    setAttendanceState('pending');
    setAttendanceReady(false);
    setAttendanceLoading(false);
  };

  return (
    <SplitLayout
      graphic={<GraphicPanel />}
      form={
        <div className="form-shell">
          {!showAttendanceGate ? (
            <header className="form-header">
              <p className="form-eyebrow">Registro CHUBB</p>
              <h1 className="form-title">Por favor, completa el siguiente formulario.</h1>
              <p className="form-subtitle">Completa el registro en pocos pasos.</p>
            </header>
          ) : null}

          {showFormSteps ? <StepperProgressBar currentStep={currentStep} totalSteps={totalSteps} /> : null}

          <div className="form-body" role="region" aria-live="polite">
            {showAttendanceGate ? (
              <div className="attendance-screen">
                {attendanceState === 'no' ? (
                  <p className="attendance-message">Gracias, ya puedes salir de esta página.</p>
                ) : attendanceLoading ? (
                  <div className="attendance-loader">
                    <div className="loader-dots" aria-hidden="true">
                      <span />
                      <span />
                      <span />
                    </div>
                    <p>Nos vemos en Los Cabos, completa tu formulario</p>
                  </div>
                ) : (
                  <>
                    <div className="attendance-copy">
                      <h1 className="attendance-title">Registro Chubb Surety Connect</h1>
                      <p className="attendance-location">📍 Los Cabos, México</p>
                      <p className="attendance-lead">
                        Para continuar con el registro para nuestro Chubb Surety Connect 2026, te pedimos nos apoyes
                        confirmando tu asistencia
                      </p>
                    </div>
                    <div className="attendance-actions">
                      <button type="button" className="btn btn-primary" onClick={handleAttendanceYes}>
                        Sí, nos vemos en Los Cabos 🌵☀️🏝️
                      </button>
                      <button type="button" className="btn btn-secondary" onClick={handleAttendanceNo}>
                        No
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : isThankYouStep ? (
              <ThankYouStepView summary={summary} onReset={handleResetAll} />
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

            {showFormSteps && !isThankYouStep && statusMessage ? (
              <FormStatusMessage type={statusMessage.type} message={statusMessage.text} />
            ) : null}
          </div>

          {showFormSteps && !isThankYouStep ? (
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

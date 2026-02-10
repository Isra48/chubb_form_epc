import { useEffect, useMemo, useState } from 'react';
import FormStepFields from './components/FormStepFields';
import FormStatusMessage from './components/FormStatusMessage';
import StepPaginationControls from './components/StepPaginationControls';
import StepperProgressBar from './components/StepperProgressBar';
import ThankYouStepView from './components/ThankYouStepView';
import { useMultiStepForm } from './hooks/useMultiStepForm';
import { useRegistration } from './hooks/useRegistration';
import GraphicPanel from './layout/GraphicPanel';
import SplitLayout from './layout/SplitLayout';

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
    title: 'Datos póliza de seguro',
    description: 'Información opcional para tu póliza.',
  },
  step5: {
    title: 'Datos contacto de emergencia',
    description: 'Información opcional del contacto de emergencia.',
  },
};

const CHUBB_MX_URL = 'https://www.chubb.com/mx-es/';

function formatYesNo(value) {
  if (value === 'si') return 'Sí';
  if (value === 'no') return 'No';
  return '';
}

function formatDateParts(day, month, year) {
  if (!day || !month || !year) return '';
  const dd = String(day).padStart(2, '0');
  const mm = String(month).padStart(2, '0');
  return `${dd}/${mm}/${year}`;
}

function formatPhoneDisplay(value) {
  const digits = (value || '').replace(/\D/g, '');
  if (digits.length !== 10) return value || '';
  return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6)}`;
}

function buildPayload(formData) {
  return {
    nombreGafete: formData.step1.badgeName?.trim(),
    nombre: formData.step1.firstName?.trim(),
    apellidoPaterno: formData.step1.paternalLastName?.trim(),
    apellidoMaterno: formData.step1.maternalLastName?.trim(),
    email: formData.step1.email?.trim(),
    ciudadOrigen: formData.step1.flightCity?.trim(),
    telefonoFijo: formData.step1.phoneLandline,
    telefonoMovil: formData.step1.phoneMobile,
    talla: formData.step1.shirtSize,
    claveAgente: formData.step2.agentKey?.trim(),
    nombreDespacho: formData.step2.officeName?.trim(),
    rfcDespacho: formData.step2.officeRfc?.trim(),
    zona: formData.step2.zone,
    tieneAlergia: formatYesNo(formData.step3.hasAllergies),
    alergias: formData.step3.allergiesDetails?.trim(),
    tienePadecimiento: formatYesNo(formData.step3.hasMedicalCondition),
    padecimientos: formData.step3.medicalDetails?.trim(),
    tieneCondicionRelevante: formatYesNo(formData.step3.hasRelevantCondition),
    condicionRelevante: formData.step3.relevantConditionDetails?.trim(),
    tomaMedicamento: formatYesNo(formData.step3.takesMedication),
    medicamento: formData.step3.medicationDetails?.trim(),
    tieneRegimen: formatYesNo(formData.step3.hasDiet),
    regimen: formData.step3.dietDetails?.trim(),
    polizaNombreCompleto: formData.step4.policyFullName?.trim(),
    polizaGenero: formData.step4.policyGender,
    polizaFechaNacimiento: formatDateParts(
      formData.step4.policyBirthDay,
      formData.step4.policyBirthMonth,
      formData.step4.policyBirthYear,
    ),
    polizaIne: formData.step4.policyIne?.trim(),
    polizaCurp: formData.step4.policyCurp?.trim(),
    polizaBeneficiarioNombre: formData.step4.policyBeneficiaryName?.trim(),
    polizaBeneficiarioParentesco: formData.step4.policyBeneficiaryRelationship?.trim(),
    contactoEmergenciaNombre: formData.step5.emergencyContactName?.trim(),
    contactoEmergenciaParentesco: formData.step5.emergencyRelationship?.trim(),
    contactoEmergenciaTelefono: formData.step5.emergencyPhone,
    imageBase64: formData.step1.profilePhotoBase64 || '',
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
    markTouched,
    goNext,
    goPrev,
    validateCurrentStep,
    showThankYou,
    resetAll,
    touchedByStep,
  } = useMultiStepForm();

  const [attendanceState, setAttendanceState] = useState('pending');
  const [attendanceReady, setAttendanceReady] = useState(false);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [submissionCopyIndex, setSubmissionCopyIndex] = useState(0);
  const { isSubmitting, errorMessage, successMessage, submitRegistration, clearMessages } = useRegistration();

  useEffect(() => {
    clearMessages();
  }, [currentStep, clearMessages]);

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

  useEffect(() => {
    if (attendanceState !== 'no') return undefined;

    const timer = setTimeout(() => {
      window.location.href = CHUBB_MX_URL;
    }, 2000);

    return () => clearTimeout(timer);
  }, [attendanceState]);

  useEffect(() => {
    if (!isSubmitting) {
      setSubmissionCopyIndex(0);
      return undefined;
    }

    const interval = setInterval(() => {
      setSubmissionCopyIndex((prev) => (prev + 1) % 4);
    }, 2000);

    return () => clearInterval(interval);
  }, [isSubmitting]);

  const handleSubmit = async () => {
    const errors = validateCurrentStep();

    if (Object.keys(errors).length > 0) {
      return;
    }

    const payload = buildPayload(formData);
    const result = await submitRegistration(payload);

    if (result.ok) {
      showThankYou();
      return;
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
      phone: formatPhoneDisplay(formData.step1.phoneMobile),
    };
  }, [formData]);

  const statusMessage = isSubmitting
    ? { type: 'loading', text: 'Enviando tu información...' }
    : errorMessage
      ? { type: 'error', text: errorMessage }
      : successMessage
        ? { type: 'success', text: successMessage }
        : null;

  const showFormSteps = attendanceReady;
  const showAttendanceGate = !attendanceReady && !isThankYouStep;

  const submissionCopy = [
    'Validando información',
    'Subiendo foto al sistema',
    'Revisando datos empresariales',
    'Esto puede tardar 2 min.',
  ];

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
              <p className="form-eyebrow">Registro Chubb Surety Connect </p>
              <h1 className="form-title">
                {isThankYouStep ? 'Gracias por completar tu registro.' : 'Por favor, completa el siguiente formulario.'}
              </h1>
         
            </header>
          ) : null}

          {showFormSteps ? <StepperProgressBar currentStep={currentStep} totalSteps={totalSteps} /> : null}

          <div className="form-body" role="region" aria-live="polite">
            {showAttendanceGate ? (
              <div className="attendance-screen">
                {attendanceState === 'no' ? (
                  <p className="attendance-message">
                    Esperamos coincidir contigo en la próxima edición de Surety Connect 
                  </p>
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
                      <h1 className="attendance-title">Registro Chubb Surety Connect 2026</h1>
                      <p className="attendance-location">📍 Los Cabos, México</p>
                      <p className="attendance-lead">
                       Para continuar con tu registro en Chubb Surety Connect 2026, ingresa tu correo para confirmar tu asistencia.
                      </p>
                    </div>
                    <div className="attendance-actions">
                      <button type="button" className="btn btn-primary" onClick={handleAttendanceYes}>
                        Sí, nos vemos en Los Cabos.
                      </button>
                      <button type="button" className="btn btn-secondary" onClick={handleAttendanceNo}>
                        No, lamento no poder acompañarlos.
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
                  touched={touchedByStep[activeStepKey]}
                  onFieldChange={updateField}
                  onFieldBlur={markTouched}
                />
              </div>
            )}

            {showFormSteps && !isThankYouStep && statusMessage ? (
              <FormStatusMessage type={statusMessage.type} message={statusMessage.text} />
            ) : null}

            {showFormSteps && !isThankYouStep && isSubmitting ? (
              <div className="submission-loader" aria-live="polite">
                <div className="loader-dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <p>{submissionCopy[submissionCopyIndex]}</p>
              </div>
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

function StepperProgressBar({ currentStep, totalSteps }) {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="progress-wrapper" aria-label="Progreso del formulario">
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <p className="progress-label">Paso {currentStep} de {totalSteps}</p>
    </div>
  );
}

export default StepperProgressBar;

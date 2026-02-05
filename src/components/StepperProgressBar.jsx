function StepperProgressBar({ currentStep, totalSteps }) {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="progress-wrapper" aria-label="Progreso del formulario">
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="progress-meta">
        <span>Progreso</span>
        <span>
          Paso {currentStep} de {totalSteps}
        </span>
      </div>
    </div>
  );
}

export default StepperProgressBar;

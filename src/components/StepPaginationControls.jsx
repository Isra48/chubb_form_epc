function StepPaginationControls({
  currentStep,
  totalSteps,
  isLoading,
  canGoNext,
  onPrev,
  onNext,
  onSubmit,
}) {
  const isFirstStep = currentStep === 1;
  const isSubmitStep = currentStep === totalSteps - 1;

  return (
    <div className="pagination-controls">
      <button type="button" className="btn btn-secondary" onClick={onPrev} disabled={isFirstStep || isLoading}>
        Anterior
      </button>

      <span className="pagination-meta">Paso {currentStep} de {totalSteps}</span>

      {!isSubmitStep ? (
        <button type="button" className="btn btn-primary" onClick={onNext} disabled={!canGoNext || isLoading}>
          Siguiente
        </button>
      ) : (
        <button type="button" className="btn btn-primary" onClick={onSubmit} disabled={!canGoNext || isLoading}>
          {isLoading ? 'Enviando...' : 'Enviar'}
        </button>
      )}
    </div>
  );
}

export default StepPaginationControls;

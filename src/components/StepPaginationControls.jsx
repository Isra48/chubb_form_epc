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
  const isSubmitStep = currentStep === 3;

  return (
    <div className="pagination-controls">
      <button type="button" onClick={onPrev} disabled={isFirstStep || isLoading}>
        Anterior
      </button>

      <span>Paso {currentStep} de {totalSteps}</span>

      {!isSubmitStep ? (
        <button type="button" onClick={onNext} disabled={!canGoNext || isLoading}>
          Siguiente
        </button>
      ) : (
        <button type="button" onClick={onSubmit} disabled={!canGoNext || isLoading}>
          {isLoading ? 'Enviando...' : 'Enviar'}
        </button>
      )}
    </div>
  );
}

export default StepPaginationControls;

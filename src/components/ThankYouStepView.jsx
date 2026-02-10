function ThankYouStepView({ summary, onReset }) {
  return (
    <div className="thank-you">
      <div className="thank-you-header">
        <p className="thank-you-eyebrow">Registro completado</p>
   
      </div>
      <p className="thank-you-lead">Tu información fue enviada correctamente, en breve nos pondremos en contacto contigo para coordinar la logísticas de tu viaje y tu asistencia  al evento.</p>
      <div className="thank-you-summary">
        <p className="thank-you-summary-title">Resumen de tu registro:</p>
        <div className="thank-you-summary-item">
          <span className="summary-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" role="presentation">
              <path
                d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-3.31 0-6 1.79-6 4v1h12v-1c0-2.21-2.69-4-6-4Z"
                fill="currentColor"
              />
            </svg>
          </span>
          <div className="summary-text">
            <span>Nombre</span>
            <strong>{summary.name || '—'}</strong>
          </div>
        </div>
        <div className="thank-you-summary-item">
          <span className="summary-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" role="presentation">
              <path
                d="M20 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 2-8 5L4 7Z"
                fill="currentColor"
              />
            </svg>
          </span>
          <div className="summary-text">
            <span>Correo</span>
            <strong>{summary.email || '—'}</strong>
          </div>
        </div>
        <div className="thank-you-summary-item">
          <span className="summary-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" role="presentation">
              <path
                d="M17 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Zm-5 20a1.25 1.25 0 1 1 1.25-1.25A1.25 1.25 0 0 1 12 22Z"
                fill="currentColor"
              />
            </svg>
          </span>
          <div className="summary-text">
            <span>Teléfono</span>
            <strong>{summary.phone || '—'}</strong>
          </div>
        </div>
      </div>
      <div className="final-message">
        <p>
          Cualquier duda, escríbenos a{' '}
          <span className="final-email">ChubbSuretyConnect2026@epconvenciones.com.mx</span>
        </p>
        <p>Staff Chubb México</p>
      </div>
      <div className="thank-you-actions">
        <button type="button" className="btn btn-secondary" onClick={onReset}>
          Crear nuevo registro
        </button>
        <a className="btn btn-primary" href="https://www.chubb.com/mx-es/">
          Finalizar
        </a>
      </div>
    </div>
  );
}

export default ThankYouStepView;

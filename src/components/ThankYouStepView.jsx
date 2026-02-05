function ThankYouStepView({ summary, onReset }) {
  return (
    <div className="thank-you">
      <div>
        <p className="thank-you-eyebrow">Registro completado</p>
        <h2>Gracias por tu tiempo.</h2>
      </div>
      <p>Recibimos tus datos. En breve te contactaremos con el siguiente paso.</p>
      <div className="thank-you-summary">
        <div>
          <span>Nombre</span>
          <strong>{summary.name || '—'}</strong>
        </div>
        <div>
          <span>Email</span>
          <strong>{summary.email || '—'}</strong>
        </div>
      </div>
      <button type="button" className="btn btn-secondary" onClick={onReset}>
        Crear nuevo registro
      </button>
    </div>
  );
}

export default ThankYouStepView;

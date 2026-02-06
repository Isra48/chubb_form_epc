function ThankYouStepView({ summary, onReset }) {
  return (
    <div className="thank-you">
      <div>
        <p className="thank-you-eyebrow">Registro completado</p>
        <h2>Gracias por tu tiempo.</h2>
      </div>
      <p>Tu registro fue enviado correctamente.</p>
      <div className="thank-you-summary">
        <div>
          <span>Nombre</span>
          <strong>{summary.name || '—'}</strong>
        </div>
        <div>
          <span>Correo electrónico</span>
          <strong>{summary.email || '—'}</strong>
        </div>
      </div>
      <div className="final-message">
        <p>Más adelante nos pondremos en contacto contigo para la planificación de tu viaje.</p>
        <p>
          Cualquier duda, escríbenos a{' '}
          <span className="final-email">ChubbSuretyConnect2026@epconvenciones.com.mx</span>
        </p>
        <p>Staff Chubb México</p>
        <p>Muchas gracias</p>
      </div>
      <button type="button" className="btn btn-secondary" onClick={onReset}>
        Crear nuevo registro
      </button>
    </div>
  );
}

export default ThankYouStepView;

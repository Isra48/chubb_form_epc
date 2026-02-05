function ThankYouStepView({ email, onReset }) {
  return (
    <div className="thank-you">
      <h2>Gracias por tu registro</h2>
      <p>Tu información fue recibida correctamente.</p>
      {email ? <p className="thank-you__summary">Resumen: {email}</p> : null}
      <button type="button" className="btn btn--primary" onClick={onReset}>
        Crear nuevo registro
      </button>
    </div>
  );
}

export default ThankYouStepView;

function ThankYouStepView({ email, onReset }) {
  return (
    <div className="thank-you">
      <h2>Gracias</h2>
      <p>Tu registro fue enviado correctamente.</p>
      {email ? <p className="summary">Email registrado: <strong>{email}</strong></p> : null}
      <button type="button" onClick={onReset}>Crear nuevo registro</button>
    </div>
  );
}

export default ThankYouStepView;

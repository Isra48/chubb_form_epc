function FormStatusMessage({ type, message }) {
  if (!message) return null;

  return (
    <p className={`status-message ${type}`} role="status" aria-live="polite">
      {message}
    </p>
  );
}

export default FormStatusMessage;

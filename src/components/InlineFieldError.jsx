function InlineFieldError({ message, id }) {
  if (!message) return null;
  return (
    <p id={id} className="field-error">
      {message}
    </p>
  );
}

export default InlineFieldError;

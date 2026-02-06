import { useCallback, useState } from 'react';
import { postRegistration } from '../api/appsScript';

export function useRegistration() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const clearMessages = useCallback(() => {
    setErrorMessage('');
    setSuccessMessage('');
  }, []);

  const submitRegistration = useCallback(async (payload) => {
    setIsSubmitting(true);
    clearMessages();

    const result = await postRegistration(payload);

    setIsSubmitting(false);

    if (result.ok) {
      setSuccessMessage('Registro enviado correctamente.');
      return { ok: true };
    }

    if (result.error?.isCorsLike) {
      setErrorMessage('No se pudo conectar, intenta de nuevo');
      return { ok: false, error: result.error };
    }

    setErrorMessage(result.error?.message || 'No fue posible enviar la información.');
    return { ok: false, error: result.error };
  }, [clearMessages]);

  return {
    isSubmitting,
    errorMessage,
    successMessage,
    submitRegistration,
    clearMessages,
  };
}

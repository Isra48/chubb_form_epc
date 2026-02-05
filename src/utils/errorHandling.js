export function normalizeNetworkError(err) {
  const rawMessage = err?.message || 'Error de red no identificado.';
  const message = typeof rawMessage === 'string' ? rawMessage : 'Error desconocido.';
  const isCorsLike = detectCorsLikeError(err, message);

  if (err?.name === 'AbortError') {
    return {
      type: 'timeout',
      message: 'La solicitud tardó demasiado. Intenta nuevamente.',
      isCorsLike: false,
      code: 'TIMEOUT',
    };
  }

  if (isCorsLike) {
    return {
      type: 'network',
      message: 'No se pudo establecer conexión con el servidor.',
      isCorsLike: true,
      code: 'CORS_LIKE',
    };
  }

  return {
    type: 'network',
    message,
    isCorsLike: false,
    code: err?.code || 'NETWORK_ERROR',
  };
}

export function detectCorsLikeError(err, message = '') {
  const normalizedMessage = message.toLowerCase();
  const hasNoResponse = !err?.response;

  return (
    (err?.name === 'TypeError' && hasNoResponse) ||
    normalizedMessage.includes('failed to fetch') ||
    normalizedMessage.includes('networkerror when attempting to fetch resource') ||
    normalizedMessage.includes('load failed')
  );
}

import { normalizeNetworkError } from '../utils/errorHandling';

export async function postRegistration(payload) {
  const endpoint = import.meta.env.VITE_APPSCRIPT_URL;

  if (!endpoint) {
    return {
      ok: false,
      error: { message: 'Falta configurar VITE_APPSCRIPT_URL.', code: 'MISSING_ENV' },
    };
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });

    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json') ? await response.json() : await response.text();

    if (!response.ok) {
      return {
        ok: false,
        error: {
          message: 'No fue posible enviar la información.',
          code: `HTTP_${response.status}`,
        },
      };
    }

    return { ok: true, data };
  } catch (err) {
    const normalized = normalizeNetworkError(err);

    return {
      ok: false,
      error: {
        message: normalized.message,
        code: normalized.code,
        isCorsLike: normalized.isCorsLike,
      },
    };
  }
}

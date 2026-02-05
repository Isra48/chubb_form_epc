import { normalizeNetworkError } from '../utils/errorHandling';

const REQUEST_TIMEOUT_MS = 12_000;

function buildTimeoutController(timeoutMs = REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  return { controller, timeoutId };
}

export async function submitForm(payload) {
  const endpoint = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL;

  if (!endpoint) {
    return {
      ok: false,
      error: { message: 'Falta configurar VITE_GOOGLE_APPS_SCRIPT_URL.', code: 'MISSING_ENV' },
    };
  }

  const { controller, timeoutId } = buildTimeoutController();

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type') || '';
    const parsedData = contentType.includes('application/json') ? await response.json() : await response.text();

    if (!response.ok) {
      return {
        ok: false,
        error: {
          message: 'No fue posible registrar la información. Intenta nuevamente.',
          code: `HTTP_${response.status}`,
        },
      };
    }

    return { ok: true, data: parsedData };
  } catch (err) {
    clearTimeout(timeoutId);
    const normalized = normalizeNetworkError(err);

    if (normalized.isCorsLike && import.meta.env.DEV) {
      console.warn('[AppsScript] possible CORS issue', err);
    }

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

const NAME_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'-]{2,60}$/;
const PHONE_REGEX = /^\d{10}$/;

export const fieldLabels = {
  firstName: 'Nombres',
  email: 'Email',
  paternalLastName: 'Apellido Paterno',
  maternalLastName: 'Apellido Materno',
  birthDay: 'Día de nacimiento',
  birthMonth: 'Mes de nacimiento',
  birthYear: 'Año de nacimiento',
  gender: 'Género',
  phone: 'Teléfono móvil',
};

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isValidPhone(value) {
  return PHONE_REGEX.test(value);
}

export function isValidName(value) {
  return NAME_REGEX.test(value.trim());
}

export function validateDateParts({ day, month, year }) {
  const dayNum = Number(day);
  const monthNum = Number(month);
  const yearNum = Number(year);
  const currentYear = new Date().getFullYear();

  if (!Number.isInteger(dayNum) || dayNum < 1 || dayNum > 31) {
    return 'Ingresa un día válido (1-31).';
  }

  if (!Number.isInteger(monthNum) || monthNum < 1 || monthNum > 12) {
    return 'Ingresa un mes válido (1-12).';
  }

  if (!Number.isInteger(yearNum) || yearNum < 1900 || yearNum > currentYear) {
    return `Ingresa un año válido (1900-${currentYear}).`;
  }

  const candidate = new Date(yearNum, monthNum - 1, dayNum);
  const isRealDate =
    candidate.getFullYear() === yearNum &&
    candidate.getMonth() === monthNum - 1 &&
    candidate.getDate() === dayNum;

  if (!isRealDate) {
    return 'La fecha de nacimiento no es válida.';
  }

  return '';
}

export function validateStepData(stepData) {
  const errors = {};

  if (!stepData.firstName.trim()) {
    errors.firstName = 'Nombres es obligatorio.';
  } else if (!isValidName(stepData.firstName)) {
    errors.firstName = 'Nombres contiene caracteres inválidos.';
  }

  if (!stepData.email.trim()) {
    errors.email = 'Email es obligatorio.';
  } else if (!isValidEmail(stepData.email)) {
    errors.email = 'Ingresa un email válido.';
  }

  if (!stepData.paternalLastName.trim()) {
    errors.paternalLastName = 'Apellido Paterno es obligatorio.';
  } else if (!isValidName(stepData.paternalLastName)) {
    errors.paternalLastName = 'Apellido Paterno contiene caracteres inválidos.';
  }

  if (!stepData.maternalLastName.trim()) {
    errors.maternalLastName = 'Apellido Materno es obligatorio.';
  } else if (!isValidName(stepData.maternalLastName)) {
    errors.maternalLastName = 'Apellido Materno contiene caracteres inválidos.';
  }

  const dateError = validateDateParts({
    day: stepData.birthDay,
    month: stepData.birthMonth,
    year: stepData.birthYear,
  });

  if (!stepData.birthDay.trim()) errors.birthDay = 'Día es obligatorio.';
  if (!stepData.birthMonth.trim()) errors.birthMonth = 'Mes es obligatorio.';
  if (!stepData.birthYear.trim()) errors.birthYear = 'Año es obligatorio.';

  if (!errors.birthDay && !errors.birthMonth && !errors.birthYear && dateError) {
    errors.birthDay = dateError;
  }

  if (!stepData.gender.trim()) {
    errors.gender = 'Género es obligatorio.';
  }

  if (!stepData.phone.trim()) {
    errors.phone = 'Teléfono móvil es obligatorio.';
  } else if (!isValidPhone(stepData.phone)) {
    errors.phone = 'El teléfono debe contener exactamente 10 dígitos.';
  }

  return errors;
}

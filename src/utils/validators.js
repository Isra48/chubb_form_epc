const NAME_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'-]{2,60}$/;
const PHONE_REGEX = /^\d{10}$/;

export const fieldLabels = {
  profilePhotoBase64: 'Foto de perfil',
  badgeName: 'Nombre para gafete',
  firstName: 'Nombre(s)',
  paternalLastName: 'Apellido Paterno',
  maternalLastName: 'Apellido Materno',
  email: 'Correo electrónico',
  birthDay: 'Día de nacimiento',
  birthMonth: 'Mes de nacimiento',
  birthYear: 'Año de nacimiento',
  gender: 'Género',
  flightCity: 'Ciudad de origen del vuelo',
  phoneLandline: 'Teléfono fijo',
  phoneMobile: 'Teléfono móvil',
  shirtSize: 'Talla de playera',
  agentKey: 'Clave de Agente/Broker',
  officeName: 'Nombre del despacho',
  officeRfc: 'RFC del despacho',
  zone: 'Zona',
  hasAllergies: 'Alergias',
  allergiesDetails: 'Alergias - especificar',
  hasMedicalCondition: 'Padecimiento médico',
  medicalDetails: 'Padecimiento médico - especificar',
  hasRelevantCondition: 'Condición médica relevante',
  relevantConditionDetails: 'Condición médica relevante - especificar',
  takesMedication: 'Medicamento',
  medicationDetails: 'Medicamento - especificar',
  hasDiet: 'Régimen alimenticio',
  dietDetails: 'Régimen alimenticio - especificar',
  policyFullName: 'Nombre completo póliza',
  policyGender: 'Género póliza',
  policyBirthDay: 'Día de nacimiento póliza',
  policyBirthMonth: 'Mes de nacimiento póliza',
  policyBirthYear: 'Año de nacimiento póliza',
  policyIne: 'No. de INE',
  policyCurp: 'CURP',
  policyBeneficiaryName: 'Nombre del beneficiario',
  policyBeneficiaryRelationship: 'Parentesco del beneficiario',
  emergencyContactName: 'Contacto de emergencia',
  emergencyRelationship: 'Parentesco',
  emergencyPhone: 'Teléfono de emergencia',
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

export function validateStepData(stepKey, stepData) {
  const errors = {};

  if (stepKey === 'step1') {
    if (!stepData.badgeName.trim()) {
      errors.badgeName = 'Nombre para gafete es obligatorio.';
    } else if (!isValidName(stepData.badgeName)) {
      errors.badgeName = 'Nombre para gafete contiene caracteres inválidos.';
    }

    if (!stepData.firstName.trim()) {
      errors.firstName = 'Nombre(s) es obligatorio.';
    } else if (!isValidName(stepData.firstName)) {
      errors.firstName = 'Nombre(s) contiene caracteres inválidos.';
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

    if (!stepData.email.trim()) {
      errors.email = 'Correo electrónico es obligatorio.';
    } else if (!isValidEmail(stepData.email)) {
      errors.email = 'Ingresa un correo válido.';
    }

    // Fecha de nacimiento y género están comentados en el formulario.

    if (!stepData.flightCity.trim()) {
      errors.flightCity = 'Ciudad de origen es obligatoria.';
    }

    if (stepData.phoneLandline.trim() && !isValidPhone(stepData.phoneLandline)) {
      errors.phoneLandline = 'El teléfono fijo debe contener 10 dígitos.';
    }

    if (!stepData.phoneMobile.trim()) {
      errors.phoneMobile = 'Teléfono móvil es obligatorio.';
    } else if (!isValidPhone(stepData.phoneMobile)) {
      errors.phoneMobile = 'El teléfono móvil debe contener 10 dígitos.';
    }

    if (!stepData.shirtSize.trim()) {
      errors.shirtSize = 'Talla de playera es obligatoria.';
    }
  }

  if (stepKey === 'step2') {
    if (!stepData.zone.trim()) {
      errors.zone = 'Zona es obligatoria.';
    }

    if (stepData.zone !== 'funcionarios-chubb') {
      if (!stepData.agentKey.trim()) {
        errors.agentKey = 'Clave de Agente/Broker es obligatoria.';
      }

      if (!stepData.officeName.trim()) {
        errors.officeName = 'Nombre del despacho es obligatorio.';
      }
    }
  }

  if (stepKey === 'step3') {
    if (!stepData.hasAllergies.trim()) {
      errors.hasAllergies = 'Indica si tienes alergias.';
    }

    if (stepData.hasAllergies === 'si' && !stepData.allergiesDetails.trim()) {
      errors.allergiesDetails = 'Favor de especificar alergias.';
    }

    if (!stepData.hasMedicalCondition.trim()) {
      errors.hasMedicalCondition = 'Indica si tienes un padecimiento médico.';
    }

    if (stepData.hasMedicalCondition === 'si' && !stepData.medicalDetails.trim()) {
      errors.medicalDetails = 'Favor de especificar el padecimiento.';
    }

    if (!stepData.hasRelevantCondition.trim()) {
      errors.hasRelevantCondition = 'Indica si tienes una condición médica relevante.';
    }

    if (stepData.hasRelevantCondition === 'si' && !stepData.relevantConditionDetails.trim()) {
      errors.relevantConditionDetails = 'Favor de especificar la condición médica relevante.';
    }

    if (!stepData.takesMedication.trim()) {
      errors.takesMedication = 'Indica si estás tomando algún medicamento.';
    }

    if (stepData.takesMedication === 'si' && !stepData.medicationDetails.trim()) {
      errors.medicationDetails = 'Favor de especificar el medicamento.';
    }

    if (!stepData.hasDiet.trim()) {
      errors.hasDiet = 'Indica si tienes un régimen alimenticio.';
    }

    if (stepData.hasDiet === 'si' && !stepData.dietDetails.trim()) {
      errors.dietDetails = 'Favor de especificar el régimen.';
    }
  }

  if (stepKey === 'step4') {
    const hasAnyPolicyData =
      stepData.policyFullName.trim() ||
      stepData.policyGender.trim() ||
      stepData.policyBirthDay.trim() ||
      stepData.policyBirthMonth.trim() ||
      stepData.policyBirthYear.trim() ||
      stepData.policyIne.trim() ||
      stepData.policyCurp.trim() ||
      stepData.policyBeneficiaryName.trim() ||
      stepData.policyBeneficiaryRelationship.trim();

    if (hasAnyPolicyData) {
      if (!stepData.policyFullName.trim()) {
        errors.policyFullName = 'El nombre completo es obligatorio.';
      }

      if (!stepData.policyGender.trim()) {
        errors.policyGender = 'El género es obligatorio.';
      }

      if (!stepData.policyBirthDay.trim() || !stepData.policyBirthMonth.trim() || !stepData.policyBirthYear.trim()) {
        errors.policyBirthDay = 'La fecha de nacimiento es obligatoria.';
      } else {
        const dateError = validateDateParts({
          day: stepData.policyBirthDay,
          month: stepData.policyBirthMonth,
          year: stepData.policyBirthYear,
        });
        if (dateError) {
          errors.policyBirthDay = dateError;
        }
      }

      if (!stepData.policyIne.trim()) {
        errors.policyIne = 'El No. de INE es obligatorio.';
      }

      if (!stepData.policyCurp.trim()) {
        errors.policyCurp = 'La CURP es obligatoria.';
      }

      if (!stepData.policyBeneficiaryName.trim()) {
        errors.policyBeneficiaryName = 'El nombre del beneficiario es obligatorio.';
      }

      if (!stepData.policyBeneficiaryRelationship.trim()) {
        errors.policyBeneficiaryRelationship = 'El parentesco es obligatorio.';
      }
    }
  }

  if (stepKey === 'step5') {
    const hasAnyEmergencyData =
      stepData.emergencyContactName.trim() ||
      stepData.emergencyRelationship.trim() ||
      stepData.emergencyPhone.trim();

    if (hasAnyEmergencyData) {
      if (!stepData.emergencyContactName.trim()) {
        errors.emergencyContactName = 'Contacto de emergencia es obligatorio.';
      } else if (!isValidName(stepData.emergencyContactName)) {
        errors.emergencyContactName = 'Nombre contiene caracteres inválidos.';
      }

      if (!stepData.emergencyRelationship.trim()) {
        errors.emergencyRelationship = 'Parentesco es obligatorio.';
      } else if (!isValidName(stepData.emergencyRelationship)) {
        errors.emergencyRelationship = 'Parentesco contiene caracteres inválidos.';
      }

      if (!stepData.emergencyPhone.trim()) {
        errors.emergencyPhone = 'Teléfono móvil es obligatorio.';
      } else if (!isValidPhone(stepData.emergencyPhone)) {
        errors.emergencyPhone = 'El teléfono móvil debe contener 10 dígitos.';
      }
    }
  }

  return errors;
}

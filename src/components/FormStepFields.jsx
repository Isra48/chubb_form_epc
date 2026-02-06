import { useState } from 'react';
import InlineFieldError from './InlineFieldError';

const genderOptions = [
  { value: '', label: 'Selecciona una opción' },
  { value: 'mujer', label: 'Mujer' },
  { value: 'hombre', label: 'Hombre' },
  { value: 'otro', label: 'Otro' },
  { value: 'prefiero-no-decir', label: 'Prefiero no decir' },
];

const shirtSizeOptions = [
  { value: '', label: 'Selecciona una opción' },
  { value: 'xs', label: 'XS' },
  { value: 's', label: 'S' },
  { value: 'm', label: 'M' },
  { value: 'l', label: 'L' },
  { value: 'xl', label: 'XL' },
  { value: 'xxl', label: 'XXL' },
];

const zoneOptions = [
  { value: '', label: 'Selecciona una opción' },
  { value: 'zona-norte', label: 'Oficina Zona Norte' },
  { value: 'zona-sur', label: 'Oficina Zona Sur' },
  { value: 'zona-occidente', label: 'Oficina Zona Occidente' },
  { value: 'zona-corredores', label: 'Oficina Zona Corredores' },
];

const yesNoOptions = [
  { value: '', label: 'Selecciona una opción' },
  { value: 'si', label: 'Sí' },
  { value: 'no', label: 'No' },
];

function FormStepFields({ stepKey, values, errors, onFieldChange }) {
  const buildFieldId = (field) => `${stepKey}-${field}`;
  const [photoError, setPhotoError] = useState('');
  const photoPreview = values.profilePhotoBase64 || '';
  const MAX_IMAGE_BYTES = 1.5 * 1024 * 1024;

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    onFieldChange(stepKey, field, value);
  };

  const handleNumericChange = (field, maxLength = 10) => (event) => {
    const value = event.target.value.replace(/\D/g, '').slice(0, maxLength);
    onFieldChange(stepKey, field, value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;

    if (!file) {
      setPhotoError('');
      onFieldChange(stepKey, 'profilePhotoBase64', '');
      onFieldChange(stepKey, 'profilePhotoName', '');
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setPhotoError('La imagen es muy pesada');
      onFieldChange(stepKey, 'profilePhotoBase64', '');
      onFieldChange(stepKey, 'profilePhotoName', '');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const base64 = typeof reader.result === 'string' ? reader.result : '';
      onFieldChange(stepKey, 'profilePhotoBase64', base64);
      onFieldChange(stepKey, 'profilePhotoName', file.name);
      setPhotoError('');
    };

    reader.onerror = () => {
      setPhotoError('No se pudo leer la imagen.');
      onFieldChange(stepKey, 'profilePhotoBase64', '');
      onFieldChange(stepKey, 'profilePhotoName', '');
    };

    reader.readAsDataURL(file);
  };

  const handleYesNoChange = (field, detailField) => (event) => {
    const value = event.target.value;
    onFieldChange(stepKey, field, value);

    if (value === 'no') {
      onFieldChange(stepKey, detailField, '');
    }
  };

  if (stepKey === 'step1') {
    return (
      <div className="step-grid">
        <div className={`field photo-field ${photoError ? 'has-error' : ''}`}>
          <label className="field-label" htmlFor={buildFieldId('profilePhoto')}>
            Foto de perfil
          </label>
          <div className="photo-uploader">
            <div className="photo-preview" aria-live="polite">
              {photoPreview ? (
                <img src={photoPreview} alt="" />
              ) : (
                <span>Sin foto</span>
              )}
            </div>
            <div className="photo-actions">
              <label className="btn btn-secondary photo-button" htmlFor={buildFieldId('profilePhoto')}>
                Subir o tomar foto
              </label>
              <input
                id={buildFieldId('profilePhoto')}
                className="file-input"
                type="file"
                accept="image/*"
                capture="user"
                onChange={handleFileChange}
              />
              <p className="photo-helper">
                {values.profilePhotoName ? values.profilePhotoName : 'PNG o JPG. Máx. 1.5 MB.'}
              </p>
            </div>
          </div>
          <InlineFieldError message={photoError} id={`${buildFieldId('profilePhoto')}-error`} />
        </div>

        <div className={`field ${errors.firstName ? 'has-error' : ''}`}>
          <label className="field-label" htmlFor={buildFieldId('firstName')}>
            Nombre(s)
          </label>
          <input
            id={buildFieldId('firstName')}
            className="field-input"
            type="text"
            value={values.firstName}
            onChange={handleInputChange('firstName')}
            aria-invalid={Boolean(errors.firstName)}
            aria-describedby={errors.firstName ? `${buildFieldId('firstName')}-error` : undefined}
          />
          <InlineFieldError message={errors.firstName} id={`${buildFieldId('firstName')}-error`} />
        </div>

        <div className={`field ${errors.paternalLastName ? 'has-error' : ''}`}>
          <label className="field-label" htmlFor={buildFieldId('paternalLastName')}>
            Apellido Paterno
          </label>
          <input
            id={buildFieldId('paternalLastName')}
            className="field-input"
            type="text"
            value={values.paternalLastName}
            onChange={handleInputChange('paternalLastName')}
            aria-invalid={Boolean(errors.paternalLastName)}
            aria-describedby={errors.paternalLastName ? `${buildFieldId('paternalLastName')}-error` : undefined}
          />
          <InlineFieldError
            message={errors.paternalLastName}
            id={`${buildFieldId('paternalLastName')}-error`}
          />
        </div>

        <div className={`field ${errors.maternalLastName ? 'has-error' : ''}`}>
          <label className="field-label" htmlFor={buildFieldId('maternalLastName')}>
            Apellido Materno
          </label>
          <input
            id={buildFieldId('maternalLastName')}
            className="field-input"
            type="text"
            value={values.maternalLastName}
            onChange={handleInputChange('maternalLastName')}
            aria-invalid={Boolean(errors.maternalLastName)}
            aria-describedby={errors.maternalLastName ? `${buildFieldId('maternalLastName')}-error` : undefined}
          />
          <InlineFieldError
            message={errors.maternalLastName}
            id={`${buildFieldId('maternalLastName')}-error`}
          />
        </div>

        <div className={`field ${errors.email ? 'has-error' : ''}`}>
          <label className="field-label" htmlFor={buildFieldId('email')}>
            Correo electrónico
          </label>
          <input
            id={buildFieldId('email')}
            className="field-input"
            type="email"
            value={values.email}
            onChange={handleInputChange('email')}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${buildFieldId('email')}-error` : undefined}
          />
          <InlineFieldError message={errors.email} id={`${buildFieldId('email')}-error`} />
        </div>

        <div className={`field date-group ${errors.birthDay || errors.birthMonth || errors.birthYear ? 'has-error' : ''}`}>
          <label className="field-label" htmlFor={buildFieldId('birthDay')}>
            Fecha de nacimiento
          </label>
          <div className="date-inputs">
            <input
              id={buildFieldId('birthDay')}
              className="field-input date-input"
              type="text"
              inputMode="numeric"
              placeholder="Día"
              value={values.birthDay}
              onChange={handleNumericChange('birthDay', 2)}
              maxLength={2}
              aria-invalid={Boolean(errors.birthDay)}
            />
            <input
              id={buildFieldId('birthMonth')}
              className="field-input date-input"
              type="text"
              inputMode="numeric"
              placeholder="Mes"
              value={values.birthMonth}
              onChange={handleNumericChange('birthMonth', 2)}
              maxLength={2}
              aria-invalid={Boolean(errors.birthMonth)}
            />
            <input
              id={buildFieldId('birthYear')}
              className="field-input date-input"
              type="text"
              inputMode="numeric"
              placeholder="Año"
              value={values.birthYear}
              onChange={handleNumericChange('birthYear', 4)}
              maxLength={4}
              aria-invalid={Boolean(errors.birthYear)}
            />
          </div>
          <InlineFieldError
            message={errors.birthDay || errors.birthMonth || errors.birthYear}
            id={`${buildFieldId('birthDay')}-error`}
          />
        </div>

        <div className={`field ${errors.gender ? 'has-error' : ''}`}>
          <label className="field-label" htmlFor={buildFieldId('gender')}>
            Género
          </label>
          <div className="select-wrapper">
            <select
              id={buildFieldId('gender')}
              className="field-input"
              value={values.gender}
              onChange={handleInputChange('gender')}
              aria-invalid={Boolean(errors.gender)}
            >
              {genderOptions.map((option) => (
                <option key={option.value || 'empty'} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="select-arrow" aria-hidden="true" />
          </div>
          <InlineFieldError message={errors.gender} id={`${buildFieldId('gender')}-error`} />
        </div>

        <div className={`field ${errors.flightCity ? 'has-error' : ''}`}>
          <label className="field-label" htmlFor={buildFieldId('flightCity')}>
            Ciudad de origen del vuelo
          </label>
          <input
            id={buildFieldId('flightCity')}
            className="field-input"
            type="text"
            value={values.flightCity}
            onChange={handleInputChange('flightCity')}
            aria-invalid={Boolean(errors.flightCity)}
            aria-describedby={errors.flightCity ? `${buildFieldId('flightCity')}-error` : undefined}
          />
          <InlineFieldError message={errors.flightCity} id={`${buildFieldId('flightCity')}-error`} />
        </div>

        <div className={`field ${errors.phoneLandline ? 'has-error' : ''}`}>
          <label className="field-label" htmlFor={buildFieldId('phoneLandline')}>
            Teléfono fijo
          </label>
          <input
            id={buildFieldId('phoneLandline')}
            className="field-input"
            type="text"
            inputMode="numeric"
            pattern="\d*"
            value={values.phoneLandline}
            onChange={handleNumericChange('phoneLandline', 10)}
            maxLength={10}
            aria-invalid={Boolean(errors.phoneLandline)}
            aria-describedby={errors.phoneLandline ? `${buildFieldId('phoneLandline')}-error` : undefined}
          />
          <InlineFieldError message={errors.phoneLandline} id={`${buildFieldId('phoneLandline')}-error`} />
        </div>

        <div className={`field ${errors.phoneMobile ? 'has-error' : ''}`}>
          <label className="field-label" htmlFor={buildFieldId('phoneMobile')}>
            Teléfono móvil
          </label>
          <input
            id={buildFieldId('phoneMobile')}
            className="field-input"
            type="text"
            inputMode="numeric"
            pattern="\d*"
            value={values.phoneMobile}
            onChange={handleNumericChange('phoneMobile', 10)}
            maxLength={10}
            aria-invalid={Boolean(errors.phoneMobile)}
            aria-describedby={errors.phoneMobile ? `${buildFieldId('phoneMobile')}-error` : undefined}
          />
          <InlineFieldError message={errors.phoneMobile} id={`${buildFieldId('phoneMobile')}-error`} />
        </div>

        <div className={`field ${errors.shirtSize ? 'has-error' : ''}`}>
          <label className="field-label" htmlFor={buildFieldId('shirtSize')}>
            Talla de playera
          </label>
          <div className="select-wrapper">
            <select
              id={buildFieldId('shirtSize')}
              className="field-input"
              value={values.shirtSize}
              onChange={handleInputChange('shirtSize')}
              aria-invalid={Boolean(errors.shirtSize)}
            >
              {shirtSizeOptions.map((option) => (
                <option key={option.value || 'empty'} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="select-arrow" aria-hidden="true" />
          </div>
          <InlineFieldError message={errors.shirtSize} id={`${buildFieldId('shirtSize')}-error`} />
        </div>
      </div>
    );
  }

  if (stepKey === 'step2') {
    return (
      <div className="step-grid">
        <div className={`field full-width ${errors.agentKey ? 'has-error' : ''}`}>
          <label className="field-label" htmlFor={buildFieldId('agentKey')}>
            Clave de Agente/Broker
          </label>
          <input
            id={buildFieldId('agentKey')}
            className="field-input"
            type="text"
            value={values.agentKey}
            onChange={handleInputChange('agentKey')}
            aria-invalid={Boolean(errors.agentKey)}
            aria-describedby={errors.agentKey ? `${buildFieldId('agentKey')}-error` : undefined}
          />
          <InlineFieldError message={errors.agentKey} id={`${buildFieldId('agentKey')}-error`} />
        </div>

        <div className={`field full-width ${errors.officeName ? 'has-error' : ''}`}>
          <label className="field-label" htmlFor={buildFieldId('officeName')}>
            Nombre del despacho
          </label>
          <input
            id={buildFieldId('officeName')}
            className="field-input"
            type="text"
            value={values.officeName}
            onChange={handleInputChange('officeName')}
            aria-invalid={Boolean(errors.officeName)}
            aria-describedby={errors.officeName ? `${buildFieldId('officeName')}-error` : undefined}
          />
          <InlineFieldError message={errors.officeName} id={`${buildFieldId('officeName')}-error`} />
        </div>

        <div className={`field ${errors.officeRfc ? 'has-error' : ''}`}>
          <label className="field-label" htmlFor={buildFieldId('officeRfc')}>
            RFC del despacho
          </label>
          <input
            id={buildFieldId('officeRfc')}
            className="field-input"
            type="text"
            value={values.officeRfc}
            onChange={handleInputChange('officeRfc')}
            aria-invalid={Boolean(errors.officeRfc)}
            aria-describedby={errors.officeRfc ? `${buildFieldId('officeRfc')}-error` : undefined}
          />
          <InlineFieldError message={errors.officeRfc} id={`${buildFieldId('officeRfc')}-error`} />
        </div>

        <div className={`field ${errors.zone ? 'has-error' : ''}`}>
          <label className="field-label" htmlFor={buildFieldId('zone')}>
            Zona a la que perteneces
          </label>
          <div className="select-wrapper">
            <select
              id={buildFieldId('zone')}
              className="field-input"
              value={values.zone}
              onChange={handleInputChange('zone')}
              aria-invalid={Boolean(errors.zone)}
            >
              {zoneOptions.map((option) => (
                <option key={option.value || 'empty'} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="select-arrow" aria-hidden="true" />
          </div>
          <InlineFieldError message={errors.zone} id={`${buildFieldId('zone')}-error`} />
        </div>
      </div>
    );
  }

  if (stepKey === 'step3') {
    return (
      <div className="step-grid">
        <div className={`field full-width ${errors.hasAllergies ? 'has-error' : ''}`}>
          <label className="field-label" htmlFor={buildFieldId('hasAllergies')}>
            ¿Tienes alguna alergia?
          </label>
          <div className="select-wrapper">
            <select
              id={buildFieldId('hasAllergies')}
              className="field-input"
              value={values.hasAllergies}
              onChange={handleYesNoChange('hasAllergies', 'allergiesDetails')}
              aria-invalid={Boolean(errors.hasAllergies)}
            >
              {yesNoOptions.map((option) => (
                <option key={option.value || 'empty'} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="select-arrow" aria-hidden="true" />
          </div>
          <InlineFieldError message={errors.hasAllergies} id={`${buildFieldId('hasAllergies')}-error`} />
        </div>

        {values.hasAllergies === 'si' ? (
          <div className={`field full-width ${errors.allergiesDetails ? 'has-error' : ''}`}>
            <label className="field-label" htmlFor={buildFieldId('allergiesDetails')}>
              Favor de especificar
            </label>
            <input
              id={buildFieldId('allergiesDetails')}
              className="field-input"
              type="text"
              value={values.allergiesDetails}
              onChange={handleInputChange('allergiesDetails')}
              aria-invalid={Boolean(errors.allergiesDetails)}
              aria-describedby={errors.allergiesDetails ? `${buildFieldId('allergiesDetails')}-error` : undefined}
            />
            <InlineFieldError
              message={errors.allergiesDetails}
              id={`${buildFieldId('allergiesDetails')}-error`}
            />
          </div>
        ) : null}

        <div className={`field full-width ${errors.hasMedicalCondition ? 'has-error' : ''}`}>
          <label className="field-label" htmlFor={buildFieldId('hasMedicalCondition')}>
            ¿Tienes algún padecimiento médico?
          </label>
          <div className="select-wrapper">
            <select
              id={buildFieldId('hasMedicalCondition')}
              className="field-input"
              value={values.hasMedicalCondition}
              onChange={handleYesNoChange('hasMedicalCondition', 'medicalDetails')}
              aria-invalid={Boolean(errors.hasMedicalCondition)}
            >
              {yesNoOptions.map((option) => (
                <option key={option.value || 'empty'} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="select-arrow" aria-hidden="true" />
          </div>
          <InlineFieldError
            message={errors.hasMedicalCondition}
            id={`${buildFieldId('hasMedicalCondition')}-error`}
          />
        </div>

        {values.hasMedicalCondition === 'si' ? (
          <div className={`field full-width ${errors.medicalDetails ? 'has-error' : ''}`}>
            <label className="field-label" htmlFor={buildFieldId('medicalDetails')}>
              Favor de especificar
            </label>
            <input
              id={buildFieldId('medicalDetails')}
              className="field-input"
              type="text"
              value={values.medicalDetails}
              onChange={handleInputChange('medicalDetails')}
              aria-invalid={Boolean(errors.medicalDetails)}
              aria-describedby={errors.medicalDetails ? `${buildFieldId('medicalDetails')}-error` : undefined}
            />
            <InlineFieldError message={errors.medicalDetails} id={`${buildFieldId('medicalDetails')}-error`} />
          </div>
        ) : null}

        <div className={`field full-width ${errors.hasDiet ? 'has-error' : ''}`}>
          <label className="field-label" htmlFor={buildFieldId('hasDiet')}>
            ¿Tienes algún régimen alimenticio?
          </label>
          <div className="select-wrapper">
            <select
              id={buildFieldId('hasDiet')}
              className="field-input"
              value={values.hasDiet}
              onChange={handleYesNoChange('hasDiet', 'dietDetails')}
              aria-invalid={Boolean(errors.hasDiet)}
            >
              {yesNoOptions.map((option) => (
                <option key={option.value || 'empty'} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="select-arrow" aria-hidden="true" />
          </div>
          <InlineFieldError message={errors.hasDiet} id={`${buildFieldId('hasDiet')}-error`} />
        </div>

        {values.hasDiet === 'si' ? (
          <div className={`field full-width ${errors.dietDetails ? 'has-error' : ''}`}>
            <label className="field-label" htmlFor={buildFieldId('dietDetails')}>
              Favor de especificar
            </label>
            <input
              id={buildFieldId('dietDetails')}
              className="field-input"
              type="text"
              value={values.dietDetails}
              onChange={handleInputChange('dietDetails')}
              aria-invalid={Boolean(errors.dietDetails)}
              aria-describedby={errors.dietDetails ? `${buildFieldId('dietDetails')}-error` : undefined}
            />
            <InlineFieldError message={errors.dietDetails} id={`${buildFieldId('dietDetails')}-error`} />
          </div>
        ) : null}
      </div>
    );
  }

  if (stepKey === 'step4') {
    return (
      <div className="step-grid">
        <div className={`field full-width ${errors.emergencyContactName ? 'has-error' : ''}`}>
          <label className="field-label" htmlFor={buildFieldId('emergencyContactName')}>
            Contacto de emergencia (nombre completo)
          </label>
          <input
            id={buildFieldId('emergencyContactName')}
            className="field-input"
            type="text"
            value={values.emergencyContactName}
            onChange={handleInputChange('emergencyContactName')}
            aria-invalid={Boolean(errors.emergencyContactName)}
            aria-describedby={errors.emergencyContactName ? `${buildFieldId('emergencyContactName')}-error` : undefined}
          />
          <InlineFieldError
            message={errors.emergencyContactName}
            id={`${buildFieldId('emergencyContactName')}-error`}
          />
        </div>

        <div className={`field ${errors.emergencyRelationship ? 'has-error' : ''}`}>
          <label className="field-label" htmlFor={buildFieldId('emergencyRelationship')}>
            Parentesco
          </label>
          <input
            id={buildFieldId('emergencyRelationship')}
            className="field-input"
            type="text"
            value={values.emergencyRelationship}
            onChange={handleInputChange('emergencyRelationship')}
            aria-invalid={Boolean(errors.emergencyRelationship)}
            aria-describedby={errors.emergencyRelationship ? `${buildFieldId('emergencyRelationship')}-error` : undefined}
          />
          <InlineFieldError
            message={errors.emergencyRelationship}
            id={`${buildFieldId('emergencyRelationship')}-error`}
          />
        </div>

        <div className={`field ${errors.emergencyPhone ? 'has-error' : ''}`}>
          <label className="field-label" htmlFor={buildFieldId('emergencyPhone')}>
            Teléfono móvil (10 dígitos)
          </label>
          <input
            id={buildFieldId('emergencyPhone')}
            className="field-input"
            type="text"
            inputMode="numeric"
            pattern="\d*"
            value={values.emergencyPhone}
            onChange={handleNumericChange('emergencyPhone', 10)}
            maxLength={10}
            aria-invalid={Boolean(errors.emergencyPhone)}
            aria-describedby={errors.emergencyPhone ? `${buildFieldId('emergencyPhone')}-error` : undefined}
          />
          <InlineFieldError message={errors.emergencyPhone} id={`${buildFieldId('emergencyPhone')}-error`} />
        </div>
      </div>
    );
  }

  return null;
}

export default FormStepFields;

import { useEffect, useRef, useState } from 'react';
import InlineFieldError from './InlineFieldError';

const CAMERA_VARIANT = 'v3';

const genderOptions = [
  { value: '', label: 'Selecciona una opción' },
  { value: 'mujer', label: 'Mujer' },
  { value: 'hombre', label: 'Hombre' },
  { value: 'otro', label: 'Otro' },
  { value: 'prefiero-no-decir', label: 'Prefiero no decir' },
];

const policyGenderOptions = [
  { value: '', label: 'Selecciona una opción' },
  { value: 'femenino', label: 'Femenino' },
  { value: 'masculino', label: 'Masculino' },
];

const shirtSizeOptions = [
  { value: '', label: 'Selecciona una opción' },
  { value: 'xs', label: 'XS' },
  { value: 's', label: 'S' },
  { value: 'm', label: 'M' },
  { value: 'l', label: 'L' },
  { value: 'xl', label: 'XL' },
  { value: 'xxl', label: 'XXL' },
  { value: 'xxxl', label: 'XXXL' },
];

const zoneOptions = [
  { value: '', label: 'Selecciona una opción' },
  { value: 'funcionarios-chubb', label: 'Funcionarios Chubb' },
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

function FormStepFields({ stepKey, values, errors, touched = {}, onFieldChange, onFieldBlur }) {
  const buildFieldId = (field) => `${stepKey}-${field}`;
  const [photoError, setPhotoError] = useState('');
  const [cameraError, setCameraError] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const photoPreview = values.profilePhotoBase64 || '';
  const MAX_IMAGE_BYTES = 1.5 * 1024 * 1024;
  const isTouched = (field) => Boolean(touched?.[field]);
  const isChubbStaff = values.zone === 'funcionarios-chubb';
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    onFieldChange(stepKey, field, value);
  };

  const handleZoneChange = (event) => {
    const value = event.target.value;
    onFieldChange(stepKey, 'zone', value);
    if (value === 'funcionarios-chubb') {
      onFieldChange(stepKey, 'agentKey', '');
      onFieldChange(stepKey, 'officeName', '');
      onFieldChange(stepKey, 'officeRfc', '');
    }
  };

  const handleBlur = (field) => () => {
    if (onFieldBlur) onFieldBlur(stepKey, field);
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
      if (onFieldBlur) onFieldBlur(stepKey, 'profilePhotoBase64');
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setPhotoError('La imagen es muy pesada');
      onFieldChange(stepKey, 'profilePhotoBase64', '');
      onFieldChange(stepKey, 'profilePhotoName', '');
      if (onFieldBlur) onFieldBlur(stepKey, 'profilePhotoBase64');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const base64 = typeof reader.result === 'string' ? reader.result : '';
      onFieldChange(stepKey, 'profilePhotoBase64', base64);
      onFieldChange(stepKey, 'profilePhotoName', file.name);
      setPhotoError('');
      if (onFieldBlur) onFieldBlur(stepKey, 'profilePhotoBase64');
    };

    reader.onerror = () => {
      setPhotoError('No se pudo leer la imagen.');
      onFieldChange(stepKey, 'profilePhotoBase64', '');
      onFieldChange(stepKey, 'profilePhotoName', '');
      if (onFieldBlur) onFieldBlur(stepKey, 'profilePhotoBase64');
    };

    reader.readAsDataURL(file);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const openCamera = async () => {
    setCameraError('');

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('La cámara no está disponible en este dispositivo.');
      return;
    }

    setShowCamera(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      setCameraError('No se pudo acceder a la cámara.');
      setShowCamera(false);
    }
  };

  const closeCamera = () => {
    setShowCamera(false);
  };

  const estimateBase64Bytes = (dataUrl) => {
    const base64 = dataUrl.split(',')[1] || '';
    return Math.ceil((base64.length * 3) / 4);
  };

  const handleCapture = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, width, height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

    if (estimateBase64Bytes(dataUrl) > MAX_IMAGE_BYTES) {
      setPhotoError('La imagen es muy pesada');
      return;
    }

    onFieldChange(stepKey, 'profilePhotoBase64', dataUrl);
    onFieldChange(stepKey, 'profilePhotoName', `camara_${Date.now()}.jpg`);
    setPhotoError('');
    closeCamera();
  };

  const handleYesNoChange = (field, detailField) => (event) => {
    const value = event.target.value;
    onFieldChange(stepKey, field, value);

    if (value === 'no') {
      onFieldChange(stepKey, detailField, '');
    }
  };

  useEffect(() => {
    if (!showCamera) {
      stopCamera();
    }
    return () => stopCamera();
  }, [showCamera]);

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
                Subir foto
              </label>
              <button type="button" className="btn btn-secondary photo-button" onClick={openCamera}>
                Tomar foto
              </button>
              <input
                id={buildFieldId('profilePhoto')}
                className="file-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <p className="photo-helper">
                {values.profilePhotoName ? values.profilePhotoName : 'PNG o JPG. Máx. 1.5 MB.'}
              </p>
              {cameraError ? <p className="photo-helper photo-helper-error">{cameraError}</p> : null}
            </div>
          </div>
          <InlineFieldError message={photoError} id={`${buildFieldId('profilePhoto')}-error`} />
        </div>

        {showCamera ? (
          <div className="camera-modal" role="dialog" aria-modal="true">
            <div className={`camera-card camera-card--${CAMERA_VARIANT}`}>
              <div className="camera-header">
                <div>
                  <h3 className="camera-title">Tomar foto</h3>
                  <p className="camera-subtitle">Vista previa en vivo</p>
                </div>
                <button type="button" className="btn btn-secondary camera-close" onClick={closeCamera}>
                  Cerrar
                </button>
              </div>
              <video ref={videoRef} className="camera-video" playsInline muted />
              <p className="camera-note">Alinea tu rostro y toma la foto con buena luz.</p>
              <div className="camera-actions">
                <button type="button" className="btn btn-secondary" onClick={closeCamera}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-primary" onClick={handleCapture}>
                  Usar foto
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <div className={`field ${isTouched('badgeName') && errors.badgeName ? 'has-error' : ''}`}>
          <label className="field-label" htmlFor={buildFieldId('badgeName')}>
            ¿Cómo te gustaría que aparezca tu nombre y apellido en el gafete?
          </label>
          <p className="field-helper">Por favor, respeta el uso de mayúsculas, minúsculas y acentos.</p>
          <input
            id={buildFieldId('badgeName')}
            className="field-input"
            type="text"
            value={values.badgeName}
            onChange={handleInputChange('badgeName')}
            onBlur={handleBlur('badgeName')}
            aria-invalid={Boolean(errors.badgeName)}
            aria-describedby={errors.badgeName ? `${buildFieldId('badgeName')}-error` : undefined}
          />
          <InlineFieldError message={isTouched('badgeName') ? errors.badgeName : ''} id={`${buildFieldId('badgeName')}-error`} />
        </div>

        <div className={`field ${isTouched('firstName') && errors.firstName ? 'has-error' : ''}`}>
          <label className="field-label" htmlFor={buildFieldId('firstName')}>
            Nombre(s)
          </label>
          <p className="field-helper">Nombre completo incluyendo apellidos (exactamente como aparece en el INE).</p>
          <input
            id={buildFieldId('firstName')}
            className="field-input"
            type="text"
            value={values.firstName}
            onChange={handleInputChange('firstName')}
            onBlur={handleBlur('firstName')}
            aria-invalid={Boolean(errors.firstName)}
            aria-describedby={errors.firstName ? `${buildFieldId('firstName')}-error` : undefined}
          />
          <InlineFieldError
            message={isTouched('firstName') ? errors.firstName : ''}
            id={`${buildFieldId('firstName')}-error`}
          />
        </div>

        <div className={`field ${isTouched('paternalLastName') && errors.paternalLastName ? 'has-error' : ''}`}>
          <label className="field-label" htmlFor={buildFieldId('paternalLastName')}>
            Apellido Paterno
          </label>
          <input
            id={buildFieldId('paternalLastName')}
            className="field-input"
            type="text"
            value={values.paternalLastName}
            onChange={handleInputChange('paternalLastName')}
            onBlur={handleBlur('paternalLastName')}
            aria-invalid={Boolean(errors.paternalLastName)}
            aria-describedby={errors.paternalLastName ? `${buildFieldId('paternalLastName')}-error` : undefined}
          />
          <InlineFieldError
            message={isTouched('paternalLastName') ? errors.paternalLastName : ''}
            id={`${buildFieldId('paternalLastName')}-error`}
          />
        </div>

        <div className={`field ${isTouched('maternalLastName') && errors.maternalLastName ? 'has-error' : ''}`}>
          <label className="field-label" htmlFor={buildFieldId('maternalLastName')}>
            Apellido Materno
          </label>
          <input
            id={buildFieldId('maternalLastName')}
            className="field-input"
            type="text"
            value={values.maternalLastName}
            onChange={handleInputChange('maternalLastName')}
            onBlur={handleBlur('maternalLastName')}
            aria-invalid={Boolean(errors.maternalLastName)}
            aria-describedby={errors.maternalLastName ? `${buildFieldId('maternalLastName')}-error` : undefined}
          />
          <InlineFieldError
            message={isTouched('maternalLastName') ? errors.maternalLastName : ''}
            id={`${buildFieldId('maternalLastName')}-error`}
          />
        </div>

        <div className={`field ${isTouched('email') && errors.email ? 'has-error' : ''}`}>
          <label className="field-label" htmlFor={buildFieldId('email')}>
            Correo electrónico
          </label>
          <input
            id={buildFieldId('email')}
            className="field-input"
            type="email"
            value={values.email}
            onChange={handleInputChange('email')}
            onBlur={handleBlur('email')}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${buildFieldId('email')}-error` : undefined}
          />
          <InlineFieldError message={isTouched('email') ? errors.email : ''} id={`${buildFieldId('email')}-error`} />
        </div>

        {/*
        <div
          className={`field date-group ${
            (isTouched('birthDay') || isTouched('birthMonth') || isTouched('birthYear')) &&
            (errors.birthDay || errors.birthMonth || errors.birthYear)
              ? 'has-error'
              : ''
          }`}
        >
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
              onBlur={handleBlur('birthDay')}
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
              onBlur={handleBlur('birthMonth')}
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
              onBlur={handleBlur('birthYear')}
              maxLength={4}
              aria-invalid={Boolean(errors.birthYear)}
            />
          </div>
          <p className="field-helper field-helper-compact">Formato: DD / MM / AAAA</p>
          <InlineFieldError
            message={
              isTouched('birthDay') || isTouched('birthMonth') || isTouched('birthYear')
                ? errors.birthDay || errors.birthMonth || errors.birthYear
                : ''
            }
            id={`${buildFieldId('birthDay')}-error`}
          />
        </div>

        <div className={`field ${isTouched('gender') && errors.gender ? 'has-error' : ''}`}>
          <label className="field-label" htmlFor={buildFieldId('gender')}>
            Género
          </label>
          <div className="select-wrapper">
            <select
              id={buildFieldId('gender')}
              className="field-input"
              value={values.gender}
              onChange={handleInputChange('gender')}
              onBlur={handleBlur('gender')}
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
          <InlineFieldError message={isTouched('gender') ? errors.gender : ''} id={`${buildFieldId('gender')}-error`} />
        </div>
        */}

        <div className={`field ${isTouched('flightCity') && errors.flightCity ? 'has-error' : ''}`}>
          <label className="field-label" htmlFor={buildFieldId('flightCity')}>
            Ciudad de origen del vuelo
          </label>
          <input
            id={buildFieldId('flightCity')}
            className="field-input"
            type="text"
            value={values.flightCity}
            onChange={handleInputChange('flightCity')}
            onBlur={handleBlur('flightCity')}
            aria-invalid={Boolean(errors.flightCity)}
            aria-describedby={errors.flightCity ? `${buildFieldId('flightCity')}-error` : undefined}
          />
          <InlineFieldError
            message={isTouched('flightCity') ? errors.flightCity : ''}
            id={`${buildFieldId('flightCity')}-error`}
          />
        </div>

        <div className={`field ${isTouched('phoneMobile') && errors.phoneMobile ? 'has-error' : ''}`}>
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
            onBlur={handleBlur('phoneMobile')}
            maxLength={10}
            aria-invalid={Boolean(errors.phoneMobile)}
            aria-describedby={errors.phoneMobile ? `${buildFieldId('phoneMobile')}-error` : undefined}
          />
          <InlineFieldError
            message={isTouched('phoneMobile') ? errors.phoneMobile : ''}
            id={`${buildFieldId('phoneMobile')}-error`}
          />
        </div>

        <div className={`field ${isTouched('phoneLandline') && errors.phoneLandline ? 'has-error' : ''}`}>
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
            onBlur={handleBlur('phoneLandline')}
            maxLength={10}
            aria-invalid={Boolean(errors.phoneLandline)}
            aria-describedby={errors.phoneLandline ? `${buildFieldId('phoneLandline')}-error` : undefined}
          />
          <InlineFieldError
            message={isTouched('phoneLandline') ? errors.phoneLandline : ''}
            id={`${buildFieldId('phoneLandline')}-error`}
          />
        </div>

        <div className={`field ${isTouched('shirtSize') && errors.shirtSize ? 'has-error' : ''}`}>
          <label className="field-label" htmlFor={buildFieldId('shirtSize')}>
            Talla
          </label>
          <div className="select-wrapper">
            <select
              id={buildFieldId('shirtSize')}
              className="field-input"
              value={values.shirtSize}
              onChange={handleInputChange('shirtSize')}
              onBlur={handleBlur('shirtSize')}
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
          <InlineFieldError
            message={isTouched('shirtSize') ? errors.shirtSize : ''}
            id={`${buildFieldId('shirtSize')}-error`}
          />
        </div>
      </div>
    );
  }

  if (stepKey === 'step2') {
    return (
      <div className="step-grid">
        <div className={`field full-width ${isTouched('zone') && errors.zone ? 'has-error' : ''}`}>
          <label className="field-label" htmlFor={buildFieldId('zone')}>
            Zona a la que perteneces
          </label>
          <div className="select-wrapper">
            <select
              id={buildFieldId('zone')}
              className="field-input"
              value={values.zone}
              onChange={handleZoneChange}
              onBlur={handleBlur('zone')}
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
          <InlineFieldError message={isTouched('zone') ? errors.zone : ''} id={`${buildFieldId('zone')}-error`} />
        </div>

        {!isChubbStaff ? (
          <div className={`field full-width ${isTouched('agentKey') && errors.agentKey ? 'has-error' : ''}`}>
            <label className="field-label" htmlFor={buildFieldId('agentKey')}>
              Clave de Agente/Broker
            </label>
            <input
              id={buildFieldId('agentKey')}
              className="field-input"
              type="text"
              value={values.agentKey}
              onChange={handleInputChange('agentKey')}
              onBlur={handleBlur('agentKey')}
              aria-invalid={Boolean(errors.agentKey)}
              aria-describedby={errors.agentKey ? `${buildFieldId('agentKey')}-error` : undefined}
            />
            <InlineFieldError
              message={isTouched('agentKey') ? errors.agentKey : ''}
              id={`${buildFieldId('agentKey')}-error`}
            />
          </div>
        ) : null}

        {!isChubbStaff ? (
          <div className={`field full-width ${isTouched('officeName') && errors.officeName ? 'has-error' : ''}`}>
            <label className="field-label" htmlFor={buildFieldId('officeName')}>
              Nombre del despacho
            </label>
            <input
              id={buildFieldId('officeName')}
              className="field-input"
              type="text"
              value={values.officeName}
              onChange={handleInputChange('officeName')}
              onBlur={handleBlur('officeName')}
              aria-invalid={Boolean(errors.officeName)}
              aria-describedby={errors.officeName ? `${buildFieldId('officeName')}-error` : undefined}
            />
            <InlineFieldError
              message={isTouched('officeName') ? errors.officeName : ''}
              id={`${buildFieldId('officeName')}-error`}
            />
          </div>
        ) : null}

      </div>
    );
  }

  if (stepKey === 'step3') {
    return (
      <div className="step-grid">
        <div className={`field full-width ${isTouched('hasAllergies') && errors.hasAllergies ? 'has-error' : ''}`}>
          <label className="field-label" htmlFor={buildFieldId('hasAllergies')}>
          ¿Tienes alguna alergia que debamos tener en cuenta?
          </label>
          <div className="select-wrapper">
            <select
              id={buildFieldId('hasAllergies')}
              className="field-input"
              value={values.hasAllergies}
              onChange={handleYesNoChange('hasAllergies', 'allergiesDetails')}
              onBlur={handleBlur('hasAllergies')}
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
          <InlineFieldError
            message={isTouched('hasAllergies') ? errors.hasAllergies : ''}
            id={`${buildFieldId('hasAllergies')}-error`}
          />
        </div>

        {values.hasAllergies === 'si' ? (
          <div className={`field full-width ${isTouched('allergiesDetails') && errors.allergiesDetails ? 'has-error' : ''}`}>
            <label className="field-label" htmlFor={buildFieldId('allergiesDetails')}>
              Favor de especificar
            </label>
            <input
              id={buildFieldId('allergiesDetails')}
              className="field-input"
              type="text"
              value={values.allergiesDetails}
              onChange={handleInputChange('allergiesDetails')}
              onBlur={handleBlur('allergiesDetails')}
              aria-invalid={Boolean(errors.allergiesDetails)}
              aria-describedby={errors.allergiesDetails ? `${buildFieldId('allergiesDetails')}-error` : undefined}
            />
            <InlineFieldError
              message={isTouched('allergiesDetails') ? errors.allergiesDetails : ''}
              id={`${buildFieldId('allergiesDetails')}-error`}
            />
          </div>
        ) : null}

        <div className={`field full-width ${isTouched('hasMedicalCondition') && errors.hasMedicalCondition ? 'has-error' : ''}`}>
          <label className="field-label" htmlFor={buildFieldId('hasMedicalCondition')}>
            ¿Tienes algún padecimiento médico?
          </label>
          <div className="select-wrapper">
            <select
              id={buildFieldId('hasMedicalCondition')}
              className="field-input"
              value={values.hasMedicalCondition}
              onChange={handleYesNoChange('hasMedicalCondition', 'medicalDetails')}
              onBlur={handleBlur('hasMedicalCondition')}
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
            message={isTouched('hasMedicalCondition') ? errors.hasMedicalCondition : ''}
            id={`${buildFieldId('hasMedicalCondition')}-error`}
          />
        </div>

        {values.hasMedicalCondition === 'si' ? (
          <div className={`field full-width ${isTouched('medicalDetails') && errors.medicalDetails ? 'has-error' : ''}`}>
            <label className="field-label" htmlFor={buildFieldId('medicalDetails')}>
              Favor de especificar
            </label>
            <input
              id={buildFieldId('medicalDetails')}
              className="field-input"
              type="text"
              value={values.medicalDetails}
              onChange={handleInputChange('medicalDetails')}
              onBlur={handleBlur('medicalDetails')}
              aria-invalid={Boolean(errors.medicalDetails)}
              aria-describedby={errors.medicalDetails ? `${buildFieldId('medicalDetails')}-error` : undefined}
            />
            <InlineFieldError
              message={isTouched('medicalDetails') ? errors.medicalDetails : ''}
              id={`${buildFieldId('medicalDetails')}-error`}
            />
          </div>
        ) : null}

        <div className={`field full-width ${isTouched('hasRelevantCondition') && errors.hasRelevantCondition ? 'has-error' : ''}`}>
          <label className="field-label" htmlFor={buildFieldId('hasRelevantCondition')}>
            ¿Tienes alguna condición médica relevante?
          </label>
          <div className="select-wrapper">
            <select
              id={buildFieldId('hasRelevantCondition')}
              className="field-input"
              value={values.hasRelevantCondition}
              onChange={handleYesNoChange('hasRelevantCondition', 'relevantConditionDetails')}
              onBlur={handleBlur('hasRelevantCondition')}
              aria-invalid={Boolean(errors.hasRelevantCondition)}
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
            message={isTouched('hasRelevantCondition') ? errors.hasRelevantCondition : ''}
            id={`${buildFieldId('hasRelevantCondition')}-error`}
          />
        </div>

        {values.hasRelevantCondition === 'si' ? (
          <div
            className={`field full-width ${isTouched('relevantConditionDetails') && errors.relevantConditionDetails ? 'has-error' : ''}`}
          >
            <label className="field-label" htmlFor={buildFieldId('relevantConditionDetails')}>
              ¿Cuál?
            </label>
            <input
              id={buildFieldId('relevantConditionDetails')}
              className="field-input"
              type="text"
              value={values.relevantConditionDetails}
              onChange={handleInputChange('relevantConditionDetails')}
              onBlur={handleBlur('relevantConditionDetails')}
              aria-invalid={Boolean(errors.relevantConditionDetails)}
              aria-describedby={errors.relevantConditionDetails ? `${buildFieldId('relevantConditionDetails')}-error` : undefined}
            />
            <InlineFieldError
              message={isTouched('relevantConditionDetails') ? errors.relevantConditionDetails : ''}
              id={`${buildFieldId('relevantConditionDetails')}-error`}
            />
          </div>
        ) : null}

        <div className={`field full-width ${isTouched('takesMedication') && errors.takesMedication ? 'has-error' : ''}`}>
          <label className="field-label" htmlFor={buildFieldId('takesMedication')}>
            ¿Estás tomando algún medicamento?
          </label>
          <div className="select-wrapper">
            <select
              id={buildFieldId('takesMedication')}
              className="field-input"
              value={values.takesMedication}
              onChange={handleYesNoChange('takesMedication', 'medicationDetails')}
              onBlur={handleBlur('takesMedication')}
              aria-invalid={Boolean(errors.takesMedication)}
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
            message={isTouched('takesMedication') ? errors.takesMedication : ''}
            id={`${buildFieldId('takesMedication')}-error`}
          />
        </div>

        {values.takesMedication === 'si' ? (
          <div className={`field full-width ${isTouched('medicationDetails') && errors.medicationDetails ? 'has-error' : ''}`}>
            <label className="field-label" htmlFor={buildFieldId('medicationDetails')}>
              ¿Cuál?
            </label>
            <input
              id={buildFieldId('medicationDetails')}
              className="field-input"
              type="text"
              value={values.medicationDetails}
              onChange={handleInputChange('medicationDetails')}
              onBlur={handleBlur('medicationDetails')}
              aria-invalid={Boolean(errors.medicationDetails)}
              aria-describedby={errors.medicationDetails ? `${buildFieldId('medicationDetails')}-error` : undefined}
            />
            <InlineFieldError
              message={isTouched('medicationDetails') ? errors.medicationDetails : ''}
              id={`${buildFieldId('medicationDetails')}-error`}
            />
          </div>
        ) : null}

        <div className={`field full-width ${isTouched('hasDiet') && errors.hasDiet ? 'has-error' : ''}`}>
          <label className="field-label" htmlFor={buildFieldId('hasDiet')}>
          ¿Tienes alguna restricción alimenticia que debamos tener en cuenta?
          </label>
          <div className="select-wrapper">
            <select
              id={buildFieldId('hasDiet')}
              className="field-input"
              value={values.hasDiet}
              onChange={handleYesNoChange('hasDiet', 'dietDetails')}
              onBlur={handleBlur('hasDiet')}
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
          <InlineFieldError message={isTouched('hasDiet') ? errors.hasDiet : ''} id={`${buildFieldId('hasDiet')}-error`} />
        </div>

        {values.hasDiet === 'si' ? (
          <div className={`field full-width ${isTouched('dietDetails') && errors.dietDetails ? 'has-error' : ''}`}>
            <label className="field-label" htmlFor={buildFieldId('dietDetails')}>
              Favor de especificar
            </label>
            <input
              id={buildFieldId('dietDetails')}
              className="field-input"
              type="text"
              value={values.dietDetails}
              onChange={handleInputChange('dietDetails')}
              onBlur={handleBlur('dietDetails')}
              aria-invalid={Boolean(errors.dietDetails)}
              aria-describedby={errors.dietDetails ? `${buildFieldId('dietDetails')}-error` : undefined}
            />
            <InlineFieldError
              message={isTouched('dietDetails') ? errors.dietDetails : ''}
              id={`${buildFieldId('dietDetails')}-error`}
            />
          </div>
        ) : null}
      </div>
    );
  }

  if (stepKey === 'step4') {
    return (
      <div className="step-grid">
        <div className={`field full-width ${isTouched('policyFullName') && errors.policyFullName ? 'has-error' : ''}`}>
          <label className="field-label" htmlFor={buildFieldId('policyFullName')}>
            Nombre completo incluyendo apellidos (exactamente como aparece en el INE)
          </label>
          <input
            id={buildFieldId('policyFullName')}
            className="field-input"
            type="text"
            value={values.policyFullName}
            onChange={handleInputChange('policyFullName')}
            onBlur={handleBlur('policyFullName')}
            aria-invalid={Boolean(errors.policyFullName)}
            aria-describedby={errors.policyFullName ? `${buildFieldId('policyFullName')}-error` : undefined}
          />
          <InlineFieldError
            message={isTouched('policyFullName') ? errors.policyFullName : ''}
            id={`${buildFieldId('policyFullName')}-error`}
          />
        </div>

        <div className={`field ${isTouched('policyGender') && errors.policyGender ? 'has-error' : ''}`}>
          <label className="field-label" htmlFor={buildFieldId('policyGender')}>
            Género
          </label>
          <div className="select-wrapper">
            <select
              id={buildFieldId('policyGender')}
              className="field-input"
              value={values.policyGender}
              onChange={handleInputChange('policyGender')}
              onBlur={handleBlur('policyGender')}
              aria-invalid={Boolean(errors.policyGender)}
            >
              {policyGenderOptions.map((option) => (
                <option key={option.value || 'empty'} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="select-arrow" aria-hidden="true" />
          </div>
          <InlineFieldError
            message={isTouched('policyGender') ? errors.policyGender : ''}
            id={`${buildFieldId('policyGender')}-error`}
          />
        </div>

        <div
          className={`field date-group ${
            (isTouched('policyBirthDay') || isTouched('policyBirthMonth') || isTouched('policyBirthYear')) &&
            (errors.policyBirthDay || errors.policyBirthMonth || errors.policyBirthYear)
              ? 'has-error'
              : ''
          }`}
        >
          <label className="field-label" htmlFor={buildFieldId('policyBirthDay')}>
            Fecha de nacimiento (día / mes / año)
          </label>
          <div className="date-inputs">
            <input
              id={buildFieldId('policyBirthDay')}
              className="field-input date-input"
              type="text"
              inputMode="numeric"
              placeholder="Día"
              value={values.policyBirthDay}
              onChange={handleNumericChange('policyBirthDay', 2)}
              onBlur={handleBlur('policyBirthDay')}
              maxLength={2}
              aria-invalid={Boolean(errors.policyBirthDay)}
            />
            <input
              id={buildFieldId('policyBirthMonth')}
              className="field-input date-input"
              type="text"
              inputMode="numeric"
              placeholder="Mes"
              value={values.policyBirthMonth}
              onChange={handleNumericChange('policyBirthMonth', 2)}
              onBlur={handleBlur('policyBirthMonth')}
              maxLength={2}
              aria-invalid={Boolean(errors.policyBirthMonth)}
            />
            <input
              id={buildFieldId('policyBirthYear')}
              className="field-input date-input"
              type="text"
              inputMode="numeric"
              placeholder="Año"
              value={values.policyBirthYear}
              onChange={handleNumericChange('policyBirthYear', 4)}
              onBlur={handleBlur('policyBirthYear')}
              maxLength={4}
              aria-invalid={Boolean(errors.policyBirthYear)}
            />
          </div>
          <p className="field-helper field-helper-compact">Formato: DD / MM / AAAA</p>
          <InlineFieldError
            message={
              isTouched('policyBirthDay') || isTouched('policyBirthMonth') || isTouched('policyBirthYear')
                ? errors.policyBirthDay || errors.policyBirthMonth || errors.policyBirthYear
                : ''
            }
            id={`${buildFieldId('policyBirthDay')}-error`}
          />
        </div>

        <div className={`field ${isTouched('policyIne') && errors.policyIne ? 'has-error' : ''}`}>
          <label className="field-label" htmlFor={buildFieldId('policyIne')}>
            No. de INE
          </label>
          <input
            id={buildFieldId('policyIne')}
            className="field-input"
            type="text"
            value={values.policyIne}
            onChange={handleInputChange('policyIne')}
            onBlur={handleBlur('policyIne')}
            aria-invalid={Boolean(errors.policyIne)}
            aria-describedby={errors.policyIne ? `${buildFieldId('policyIne')}-error` : undefined}
          />
          <InlineFieldError message={isTouched('policyIne') ? errors.policyIne : ''} id={`${buildFieldId('policyIne')}-error`} />
        </div>

        <div className={`field ${isTouched('policyCurp') && errors.policyCurp ? 'has-error' : ''}`}>
          <label className="field-label" htmlFor={buildFieldId('policyCurp')}>
            CURP
          </label>
          <input
            id={buildFieldId('policyCurp')}
            className="field-input"
            type="text"
            value={values.policyCurp}
            onChange={handleInputChange('policyCurp')}
            onBlur={handleBlur('policyCurp')}
            aria-invalid={Boolean(errors.policyCurp)}
            aria-describedby={errors.policyCurp ? `${buildFieldId('policyCurp')}-error` : undefined}
          />
          <InlineFieldError
            message={isTouched('policyCurp') ? errors.policyCurp : ''}
            id={`${buildFieldId('policyCurp')}-error`}
          />
        </div>

        <div className={`field full-width ${isTouched('policyBeneficiaryName') && errors.policyBeneficiaryName ? 'has-error' : ''}`}>
          <label className="field-label" htmlFor={buildFieldId('policyBeneficiaryName')}>
            Nombre del beneficiario
          </label>
          <input
            id={buildFieldId('policyBeneficiaryName')}
            className="field-input"
            type="text"
            value={values.policyBeneficiaryName}
            onChange={handleInputChange('policyBeneficiaryName')}
            onBlur={handleBlur('policyBeneficiaryName')}
            aria-invalid={Boolean(errors.policyBeneficiaryName)}
            aria-describedby={errors.policyBeneficiaryName ? `${buildFieldId('policyBeneficiaryName')}-error` : undefined}
          />
          <InlineFieldError
            message={isTouched('policyBeneficiaryName') ? errors.policyBeneficiaryName : ''}
            id={`${buildFieldId('policyBeneficiaryName')}-error`}
          />
        </div>

        <div className={`field ${isTouched('policyBeneficiaryRelationship') && errors.policyBeneficiaryRelationship ? 'has-error' : ''}`}>
          <label className="field-label" htmlFor={buildFieldId('policyBeneficiaryRelationship')}>
            Parentesco
          </label>
          <input
            id={buildFieldId('policyBeneficiaryRelationship')}
            className="field-input"
            type="text"
            value={values.policyBeneficiaryRelationship}
            onChange={handleInputChange('policyBeneficiaryRelationship')}
            onBlur={handleBlur('policyBeneficiaryRelationship')}
            aria-invalid={Boolean(errors.policyBeneficiaryRelationship)}
            aria-describedby={errors.policyBeneficiaryRelationship ? `${buildFieldId('policyBeneficiaryRelationship')}-error` : undefined}
          />
          <InlineFieldError
            message={isTouched('policyBeneficiaryRelationship') ? errors.policyBeneficiaryRelationship : ''}
            id={`${buildFieldId('policyBeneficiaryRelationship')}-error`}
          />
        </div>
      </div>
    );
  }

  if (stepKey === 'step5') {
    return (
      <div className="step-grid">
        <div className={`field full-width ${isTouched('emergencyContactName') && errors.emergencyContactName ? 'has-error' : ''}`}>
          <label className="field-label" htmlFor={buildFieldId('emergencyContactName')}>
            Nombre completo de contacto de emergencia
          </label>
          <input
            id={buildFieldId('emergencyContactName')}
            className="field-input"
            type="text"
            value={values.emergencyContactName}
            onChange={handleInputChange('emergencyContactName')}
            onBlur={handleBlur('emergencyContactName')}
            aria-invalid={Boolean(errors.emergencyContactName)}
            aria-describedby={errors.emergencyContactName ? `${buildFieldId('emergencyContactName')}-error` : undefined}
          />
          <InlineFieldError
            message={isTouched('emergencyContactName') ? errors.emergencyContactName : ''}
            id={`${buildFieldId('emergencyContactName')}-error`}
          />
        </div>

        <div className={`field ${isTouched('emergencyRelationship') && errors.emergencyRelationship ? 'has-error' : ''}`}>
          <label className="field-label" htmlFor={buildFieldId('emergencyRelationship')}>
            Parentesco
          </label>
          <input
            id={buildFieldId('emergencyRelationship')}
            className="field-input"
            type="text"
            value={values.emergencyRelationship}
            onChange={handleInputChange('emergencyRelationship')}
            onBlur={handleBlur('emergencyRelationship')}
            aria-invalid={Boolean(errors.emergencyRelationship)}
            aria-describedby={errors.emergencyRelationship ? `${buildFieldId('emergencyRelationship')}-error` : undefined}
          />
          <InlineFieldError
            message={isTouched('emergencyRelationship') ? errors.emergencyRelationship : ''}
            id={`${buildFieldId('emergencyRelationship')}-error`}
          />
        </div>

        <div className={`field ${isTouched('emergencyPhone') && errors.emergencyPhone ? 'has-error' : ''}`}>
          <label className="field-label" htmlFor={buildFieldId('emergencyPhone')}>
            Teléfono móvil
          </label>
          <input
            id={buildFieldId('emergencyPhone')}
            className="field-input"
            type="text"
            inputMode="numeric"
            pattern="\\d*"
            value={values.emergencyPhone}
            onChange={handleNumericChange('emergencyPhone', 10)}
            onBlur={handleBlur('emergencyPhone')}
            maxLength={10}
            aria-invalid={Boolean(errors.emergencyPhone)}
            aria-describedby={errors.emergencyPhone ? `${buildFieldId('emergencyPhone')}-error` : undefined}
          />
          <InlineFieldError
            message={isTouched('emergencyPhone') ? errors.emergencyPhone : ''}
            id={`${buildFieldId('emergencyPhone')}-error`}
          />
        </div>
      </div>
    );
  }

  return null;
}

export default FormStepFields;

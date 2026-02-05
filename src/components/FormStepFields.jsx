import InlineFieldError from './InlineFieldError';

const genderOptions = [
  { value: '', label: 'Selecciona una opcion' },
  { value: 'mujer', label: 'Mujer' },
  { value: 'hombre', label: 'Hombre' },
  { value: 'otro', label: 'Otro' },
  { value: 'prefiero-no-decir', label: 'Prefiero no decir' },
];

function FormStepFields({ stepKey, values, errors, onFieldChange }) {
  const buildFieldId = (field) => `${stepKey}-${field}`;

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    onFieldChange(stepKey, field, value);
  };

  return (
    <div className="step-grid">
      <div className={`field ${errors.firstName ? 'has-error' : ''}`}>
        <label className="field-label" htmlFor={buildFieldId('firstName')}>
          Nombres
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

      <div className={`field ${errors.email ? 'has-error' : ''}`}>
        <label className="field-label" htmlFor={buildFieldId('email')}>
          Email
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

      <div className={`field date-group ${errors.birthDay || errors.birthMonth || errors.birthYear ? 'has-error' : ''}`}>
        <label className="field-label" htmlFor={buildFieldId('birthDay')}>
          Fecha de nacimiento
        </label>
        <div className="date-inputs">
          <input
            id={buildFieldId('birthDay')}
            className="field-input date-input"
            type="number"
            min="1"
            max="31"
            placeholder="Dia"
            value={values.birthDay}
            onChange={handleInputChange('birthDay')}
            aria-invalid={Boolean(errors.birthDay)}
          />
          <input
            id={buildFieldId('birthMonth')}
            className="field-input date-input"
            type="number"
            min="1"
            max="12"
            placeholder="Mes"
            value={values.birthMonth}
            onChange={handleInputChange('birthMonth')}
            aria-invalid={Boolean(errors.birthMonth)}
          />
          <input
            id={buildFieldId('birthYear')}
            className="field-input date-input"
            type="number"
            min="1900"
            max={new Date().getFullYear()}
            placeholder="Ano"
            value={values.birthYear}
            onChange={handleInputChange('birthYear')}
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
          Genero
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

      <div className={`field ${errors.phone ? 'has-error' : ''}`}>
        <label className="field-label" htmlFor={buildFieldId('phone')}>
          Telefono movil
        </label>
        <input
          id={buildFieldId('phone')}
          className="field-input"
          type="tel"
          inputMode="numeric"
          pattern="\d*"
          value={values.phone}
          onChange={handleInputChange('phone')}
          maxLength={10}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? `${buildFieldId('phone')}-error` : undefined}
        />
        <InlineFieldError message={errors.phone} id={`${buildFieldId('phone')}-error`} />
      </div>
    </div>
  );
}

export default FormStepFields;

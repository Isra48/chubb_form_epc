import InlineFieldError from './InlineFieldError';

const genderOptions = [
  { value: '', label: 'Selecciona una opción' },
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
      <label className="field">
        <span>Nombres</span>
        <input type="text" value={values.firstName} onChange={handleInputChange('firstName')} />
        <InlineFieldError message={errors.firstName} />
      </label>

      <label className="field">
        <span>Email</span>
        <input type="email" value={values.email} onChange={handleInputChange('email')} />
        <InlineFieldError message={errors.email} />
      </label>

      <label className="field">
        <span>Apellido Paterno</span>
        <input type="text" value={values.paternalLastName} onChange={handleInputChange('paternalLastName')} />
        <InlineFieldError message={errors.paternalLastName} />
      </label>

      <label className="field">
        <span>Apellido Materno</span>
        <input type="text" value={values.maternalLastName} onChange={handleInputChange('maternalLastName')} />
        <InlineFieldError message={errors.maternalLastName} />
      </label>

      <div className="field date-group">
        <span>Fecha de nacimiento</span>
        <div className="date-inputs">
          <input
            id={buildFieldId('birthDay')}
            type="number"
            min="1"
            max="31"
            placeholder="Día"
            value={values.birthDay}
            onChange={handleInputChange('birthDay')}
          />
          <input
            id={buildFieldId('birthMonth')}
            type="number"
            min="1"
            max="12"
            placeholder="Mes"
            value={values.birthMonth}
            onChange={handleInputChange('birthMonth')}
          />
          <input
            id={buildFieldId('birthYear')}
            type="number"
            min="1900"
            max={new Date().getFullYear()}
            placeholder="Año"
            value={values.birthYear}
            onChange={handleInputChange('birthYear')}
          />
        </div>
        <InlineFieldError message={errors.birthDay || errors.birthMonth || errors.birthYear} />
      </div>

      <label className="field">
        <span>Género</span>
        <select value={values.gender} onChange={handleInputChange('gender')}>
          {genderOptions.map((option) => (
            <option key={option.value || 'empty'} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <InlineFieldError message={errors.gender} />
      </label>

      <label className="field">
        <span>Teléfono móvil</span>
        <input
          type="tel"
          inputMode="numeric"
          pattern="\d*"
          value={values.phone}
          onChange={handleInputChange('phone')}
          maxLength={10}
        />
        <InlineFieldError message={errors.phone} />
      </label>
    </div>
  );
}

export default FormStepFields;

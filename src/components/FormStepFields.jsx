import InlineFieldError from './InlineFieldError';

const genderOptions = [
  { value: '', label: 'Selecciona una opción' },
  { value: 'mujer', label: 'Mujer' },
  { value: 'hombre', label: 'Hombre' },
  { value: 'otro', label: 'Otro' },
  { value: 'prefiero-no-decir', label: 'Prefiero no decir' },
];

function FormStepFields({ stepKey, values, errors, onFieldChange }) {
  const inputClass = (field) => `underline-input ${errors[field] ? 'underline-input--error' : ''}`;

  const onChange = (field) => (event) => {
    let nextValue = event.target.value;

    if (field === 'phone') {
      nextValue = nextValue.replace(/\D/g, '').slice(0, 10);
    }

    if (['birthDay', 'birthMonth', 'birthYear'].includes(field)) {
      nextValue = nextValue.replace(/\D/g, '');
    }

    onFieldChange(stepKey, field, nextValue);
  };

  return (
    <div className="step-grid">
      <label className="field">
        <span className="field__label">Nombres</span>
        <input className={inputClass('firstName')} type="text" value={values.firstName} onChange={onChange('firstName')} />
        <InlineFieldError message={errors.firstName} />
      </label>

      <label className="field">
        <span className="field__label">Email</span>
        <input className={inputClass('email')} type="email" value={values.email} onChange={onChange('email')} />
        <InlineFieldError message={errors.email} />
      </label>

      <label className="field">
        <span className="field__label">Apellido Paterno</span>
        <input className={inputClass('paternalLastName')} type="text" value={values.paternalLastName} onChange={onChange('paternalLastName')} />
        <InlineFieldError message={errors.paternalLastName} />
      </label>

      <label className="field">
        <span className="field__label">Apellido Materno</span>
        <input className={inputClass('maternalLastName')} type="text" value={values.maternalLastName} onChange={onChange('maternalLastName')} />
        <InlineFieldError message={errors.maternalLastName} />
      </label>

      <div className="field field--full">
        <span className="field__label">Fecha de nacimiento</span>
        <div className="date-inputs">
          <input className={inputClass('birthDay')} type="text" inputMode="numeric" placeholder="Día" value={values.birthDay} onChange={onChange('birthDay')} />
          <input className={inputClass('birthMonth')} type="text" inputMode="numeric" placeholder="Mes" value={values.birthMonth} onChange={onChange('birthMonth')} />
          <input className={inputClass('birthYear')} type="text" inputMode="numeric" placeholder="Año" value={values.birthYear} onChange={onChange('birthYear')} />
        </div>
        <InlineFieldError message={errors.birthDay || errors.birthMonth || errors.birthYear} />
      </div>

      <label className="field">
        <span className="field__label">Género</span>
        <select className={inputClass('gender')} value={values.gender} onChange={onChange('gender')}>
          {genderOptions.map((option) => (
            <option key={option.value || 'empty'} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <InlineFieldError message={errors.gender} />
      </label>

      <label className="field">
        <span className="field__label">Teléfono móvil</span>
        <input className={inputClass('phone')} type="tel" inputMode="numeric" value={values.phone} onChange={onChange('phone')} maxLength={10} />
        <InlineFieldError message={errors.phone} />
      </label>
    </div>
  );
}

export default FormStepFields;

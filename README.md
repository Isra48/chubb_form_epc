# Multi-step Form (Vite + React + SCSS)

## Requisitos
- Node.js 18+

## Instalación
```bash
npm install
```

## Variables de entorno
1. Copia `.env.example` a `.env`
2. Configura tu endpoint de Google Apps Script:

```env
VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/TU_DEPLOY/exec
```

## Desarrollo
```bash
npm run dev
```

## Build
```bash
npm run build
```

## Ejemplo de payload final
```json
{
  "submittedAt": "2026-02-05T10:00:00.000Z",
  "step1": {
    "firstName": "Ana",
    "email": "ana@email.com",
    "paternalLastName": "Pérez",
    "maternalLastName": "López",
    "birthDay": "12",
    "birthMonth": "09",
    "birthYear": "1994",
    "gender": "mujer",
    "phone": "5512345678"
  },
  "step2": { "...": "mismos campos" },
  "step3": { "...": "mismos campos" }
}
```

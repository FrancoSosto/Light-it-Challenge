# Frontend Challenge - Patient Data Management (Light-it)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC)](https://tailwindcss.com/)

Aplicación React + TypeScript para gestionar pacientes consumiendo la API mock `https://63bedcf7f5cfc0949b634fc8.mockapi.io/users`.

---

## 🚀 Cómo levantar el proyecto

**Requisitos**: Node 18+ y npm.

### Instalación y desarrollo

```bash
# 1) Instalar dependencias
npm install

# 2) Ambiente de desarrollo con HMR
npm run dev

# 3) Build de producción (incluye type-check)
npm run build

# 4) Preview del build
npm run preview
```

### Testing

```bash
# Ejecutar tests
npm run test

# Tests con UI interactiva
npm run test:ui

# Coverage report
npm run test:coverage
```

### Code Quality

```bash
# Linting
npm run lint
npm run lint:fix

# Formateo de código
npm run format
npm run format:check
```

---

## 🧱 Arquitectura y Stack

### Stack Tecnológico

| Categoría | Tecnología | Justificación |
|-----------|-----------|---------------|
| **Framework** | React 19 + TypeScript | Type-safety, mejor DX, detección temprana de errores |
| **Build Tool** | Vite 7 | HMR ultrarrápido, configuración zero-config, mejor performance |
| **Estado Remoto** | TanStack Query v5 | Cache automático, revalidación, retry logic, estados de carga |
| **Formularios** | React Hook Form + Zod | Validación declarativa, performance (uncontrolled), type-safe schemas |
| **HTTP Client** | Axios | Interceptores, mejor manejo de errores, cancelación de requests |
| **Estilos** | TailwindCSS + clsx + tailwind-merge | Utility-first, tree-shaking automático, DX optimizada |
| **Testing** | Vitest + Testing Library | Compatible con Vite, API similar a Jest, rápido |
| **Linting** | ESLint + typescript-eslint | Calidad de código, mejores prácticas |
| **Formateo** | Prettier | Consistencia de código en el equipo |

### Decisiones de Arquitectura

#### 1. **Feature-Based Structure**
```
src/
├── components/          # Componentes reutilizables (UI Kit)
│   ├── ui/             # Button, Input, Card, Modal, Toast, LazyImage
│   └── ErrorBoundary.tsx
├── features/           # Features organizadas por dominio
│   └── patients/
│       ├── components/ # Componentes específicos del feature
│       ├── services/   # Lógica de API
│       └── hooks/      # Custom hooks del feature
├── lib/                # Utilidades y configuraciones
├── types/              # Tipos globales
└── App.tsx
```

**Por qué esta estructura:**
- **Escalabilidad**: Cada feature es autónomo
- **Mantenibilidad**: Código relacionado vive junto
- **Reutilización**: Componentes UI separados de lógica de negocio
- **Testabilidad**: Features aislados son más fáciles de testear

#### 2. **State Management Strategy**

```typescript
// ❌ NO usamos Redux/Zustand para estado remoto
// ✅ TanStack Query para servidor, useState para UI local

const { data, isLoading } = useQuery({
  queryKey: ['pacientes'],
  queryFn: obtenerPacientes,
  staleTime: 5 * 60 * 1000, // Cache de 5 minutos
  retry: 3,                  // 3 reintentos automáticos
});
```

**Ventajas**:
- Cache automático
- Revalidación en background
- Retry logic con backoff exponencial
- Estados de carga/error built-in
- Menos boilerplate que Redux

#### 3. **Form Validation con Zod**

```typescript
const esquemaPaciente = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  avatar: z.string().url('Debe ser una URL válida'),
  description: z.string().min(1),
  website: z.string().url(),
});
```

**Por qué Zod sobre otros validadores:**
- Type inference automático
- Mensajes de error customizables
- Validaciones complejas declarativas
- Integración perfecta con TypeScript

#### 4. **Componentes sin librerías externas**

Todos los componentes UI (Button, Input, Card, Modal, Toast) están construidos desde cero:

**Ventajas**:
- Control total sobre el comportamiento
- Bundle size reducido
- No hay dependencias con breaking changes
- Customización sin limitaciones

#### 5. **Performance Optimizations**

```typescript
// Lazy loading de componentes
const PatientForm = lazy(() => import('./PatientForm'));
const PatientList = lazy(() => import('./PatientList'));

// Lazy loading de imágenes con placeholder
<LazyImage src={avatar} alt={name} />

// Memoización estratégica
const fechaCreacion = useMemo(() => formatDate(createdAt), [createdAt]);
```

#### 6. **Accesibilidad (A11y)**

- **Focus trap** en modales
- **Keyboard navigation** (Escape para cerrar)
- **ARIA labels** y roles semánticos
- **Screen reader support** (aria-live, role="alert")
- **Focus management** (retorno de foco al cerrar modal)

#### 7. **Error Handling**

```typescript
<ErrorBoundary>           // Captura errores de React
  <QueryClient            // Retry automático 3x
    defaultOptions={{
      queries: { retry: 3, retryDelay: (i) => Math.min(1000 * 2 ** i, 30000) }
    }}
  />
</ErrorBoundary>
```

---

## 🗂️ Estructura del Proyecto

```
code-challenge/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx          # Botón reutilizable con estados loading
│   │   │   ├── Input.tsx           # Input con validación y errores
│   │   │   ├── Card.tsx            # Card base con variantes
│   │   │   ├── Modal.tsx           # Modal con portal, focus trap, a11y
│   │   │   ├── Toast.tsx           # Sistema de notificaciones
│   │   │   └── LazyImage.tsx       # Imagen con lazy loading
│   │   └── ErrorBoundary.tsx       # Error boundary con UI de fallback
│   ├── features/
│   │   └── patients/
│   │       ├── components/
│   │       │   ├── PatientCard.tsx      # Card de paciente con expand/collapse
│   │       │   ├── PatientCard.test.tsx
│   │       │   ├── PatientForm.tsx      # Formulario con validación Zod
│   │       │   ├── PatientForm.test.tsx
│   │       │   └── PatientList.tsx      # Lista con estados loading/error
│   │       ├── services/
│   │       │   ├── patientService.ts    # Lógica de API
│   │       │   └── patientService.test.ts
│   │       └── hooks/
│   │           └── usePatientCard.ts    # Hook custom para lógica de card
│   ├── lib/
│   │   ├── axios.ts                # Instancia configurada de Axios
│   │   └── utils.ts                # Utilidades (cn para classnames)
│   ├── types/
│   │   └── index.ts                # Tipos globales (IPaciente, etc)
│   ├── App.tsx                     # Componente principal con lazy loading
│   ├── App.test.tsx               # Tests de integración
│   ├── main.tsx                    # Entry point
│   ├── index.css                   # Estilos globales y fuente
│   └── setupTests.ts               # Configuración de tests
├── .prettierrc                     # Configuración de Prettier
├── .prettierignore
├── eslint.config.js               # ESLint flat config
├── tailwind.config.js             # Theme custom (colores, animaciones)
├── tsconfig.json                  # TypeScript strict mode
├── vite.config.ts                 # Vite + path aliases
└── vitest.config.ts              # Configuración de tests
```

---

## 🌐 API Mock

- **Base URL**: `https://63bedcf7f5cfc0949b634fc8.mockapi.io`
- **Recurso**: `/users`
- **Campos**: `id`, `name`, `avatar`, `description`, `website`, `createdAt`
- **Operaciones**:
  - `GET /users` - Listar pacientes
  - `POST /users` - Crear paciente
  - `PUT /users/:id` - Actualizar paciente

---

## 🧭 Decisiones de UX/UI

### Design System

- **Theme oscuro**: Fondo `#0b1220` con gradientes sutiles
- **Paleta de colores**:
  - Acento: `#60a5fa` (azul)
  - Panel: `#111827`
  - Bordes: `#1f2a3c`
- **Tipografía**: Space Grotesk (Google Fonts)
- **Shadows**: Sistema de sombras con `shadow-vidrio` y `shadow-suave`

### Animaciones

```css
/* Entrada de cards con stagger */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px) scale(0.99); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

/* Cada card tiene delay escalonado */
animation-delay: calc(index * 60ms)
```

- **Cards**: Fade-up con stagger
- **Modal**: Zoom-in + fade-in
- **Toast**: Slide-in desde derecha

### Accesibilidad

- ✅ Modales accesibles (Escape, click fuera, focus trap)
- ✅ Toasts con `role="alert"` y `aria-live="assertive"`
- ✅ Labels semánticos en formularios
- ✅ Estados de loading visibles
- ✅ Feedback visual de errores

---

## 🧪 Testing Strategy

### Coverage

```bash
npm run test:coverage
```

- **PatientCard.test.tsx**: Tests unitarios del componente card
- **PatientForm.test.tsx**: Tests de validación y modos crear/editar
- **patientService.test.tsx**: Tests de servicios API con mocks
- **App.test.tsx**: Tests de integración end-to-end

### Tipos de Tests

1. **Unitarios**: Componentes individuales aislados
2. **Integración**: Flujos completos (crear paciente, expandir card)
3. **Servicios**: Lógica de API con Axios mockeado

---

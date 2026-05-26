# BiblioTech - Sistema de Gestión de Biblioteca

## Descripción del Proyecto

BiblioTech es una plataforma web diseñada para gestionar de manera eficiente las operaciones de una biblioteca, facilitando el control de prestamos, inventario y acceso a la informacion tanto para lectores como para administradores.

### Problemas que Resuelve

- **Trazabilidad de prestamos**: Seguimiento completo del historial de prestamos por usuario y libro
- **Control de inventario**: Gestion de disponibilidad y unidades de libros
- **Acceso a informacion**: Portal centralizado para consultar catalogo y reglas de la biblioteca
- **Recomendaciones inteligentes**: Sugerencias de lectura basadas en IA

---

## Perfiles de Usuario

### Lector
- Consultar catalogo de libros disponibles
- Solicitar prestamos (segun reglas establecidas)
- Ver historial personal de prestamos
- Recibir recomendaciones de libros mediante IA
- Consultar reglas de la biblioteca

### Administrador
- Todas las funcionalidades del lector
- CRUD completo de libros (crear, editar, eliminar)
- Gestionar reglas de la biblioteca (dias de prestamo, limite de libros)
- Ver metricas y estadisticas (total de prestamos, por usuario, historial general)
- Gestionar prestamos de todos los usuarios

---

## Reglas de Negocio

### Gestion de Unidades
- Un libro puede tener multiples unidades fisicas
- `unidades_disponibles` se actualiza con cada prestamo/devolucion
- **No permitir prestamos** si `unidades_disponibles === 0`

### Reglas de Prestamo
- Un lector no puede prestar mas libros que el `max_libros_simultaneos` (configurable, por defecto 3)
- La `fecha_devolucion_esperada` se calcula automaticamente: `fecha_prestamo + dias_prestamo` (configurable, por defecto 14 dias)
- Los prestamos vencidos deben marcarse automaticamente cuando pasa la fecha de devolucion esperada

### Estados de Prestamo
- **activo**: El libro esta prestado y dentro del plazo
- **vencido**: El libro esta prestado y paso la fecha de devolucion esperada
- **devuelto**: El libro fue devuelto exitosamente

---

## Arquitectura del Proyecto

```
src/
├── assets/              # Estilos globales (style.css)
├── components/          # Componentes reutilizables Vue
│   ├── BookCard.vue     # Tarjeta de libro para el catalogo
│   ├── BookForm.vue     # Formulario para crear/editar libros
│   ├── LoanTable.vue    # Tabla de prestamos
│   └── AIChat.vue       # Chat flotante con IA
├── composables/         # Logica reutilizable Vue (Composition API)
│   ├── useAuth.js       # Autenticacion
│   ├── useFetch.js      # Fetch de datos con estados
│   ├── useForm.js       # Manejo de formularios
│   └── useModal.js      # Gestion de modales
├── mocks/               # Datos de prueba (fase inicial)
│   ├── books.json       # 6 libros de ejemplo
│   ├── loans.json       # 3 prestamos de ejemplo
│   └── users.json       # 3 usuarios de ejemplo
├── router/              # Configuracion de rutas Vue Router
├── services/            # Capa de negocio
│   ├── supabase.js      # Cliente Supabase (opcional)
│   ├── gemini.js        # Integracion con Google Gemini AI
│   └── api.js           # Capa de abstraccion (usa mocks o Supabase)
├── stores/              # Estado global Pinia
│   ├── auth.js          # Autenticacion y usuario
│   ├── books.js         # Gestion de libros
│   ├── loans.js         # Gestion de prestamos
│   └── recommendations.js # Cache de recomendaciones IA
├── utils/               # Funciones auxiliares
│   └── dateHelpers.js   # Formato de fechas
└── views/               # Paginas principales
    ├── LoginView.vue    # Login / Registro
    ├── CatalogView.vue  # Catalogo de libros
    ├── MyLoansView.vue  # Mis prestamos
    ├── RulesView.vue    # Reglas de la biblioteca
    ├── MetricsView.vue  # Metricas (solo admin)
    └── AdminBooksView.vue # Gestion de libros (solo admin)
```

---

## Flujo de Datos

### Capa de Servicios (`services/api.js`)
Esta capa decide automaticamente si usar datos reales o mocks:

```
Solicitud API
     ↓
┌─────────────────┐
│   services/api  │ ← Detecta si Supabase esta configurado
└────────┬────────┘
         ↓
   ┌─────┴─────┐
   ↓           ↓
Mocks      Supabase
(JSON)     (Real)
```

### Cache de Recomendaciones (`stores/recommendations.js`)
```
Solicitud recomendaciones
         ↓
┌─────────────────────┐
│  Cache en memoria   │ ← TTL: 1 hora
│  (Pinia store)      │
└──────────┬──────────┘
           ↓
    ┌──────┴──────┐
    ↓             ↓
  Cache hit    Cache miss
  (inmediato)    ↓
            ┌────┴────┐
            │ Gemini  │
            │   AI    │
            └─────────┘
```

---

## Guia de Funcionalidades

### 1. Autenticacion

**Login:**
- Email: `admin@bibliotech.com` (administrador)
- Email: `lector@bibliotech.com` (lector)
- Contrasena: cualquier valor funciona en modo demo

**Registro:**
- Nuevo usuario se crea con rol "lector" por defecto

### 2. Catalogo de Libros

1. Ver todos los libros disponibles en grid
2. Filtrar por:
   - Busqueda (titulo o autor)
   - Genero
   - Disponibilidad (disponibles/sin stock)
3. Click en libro para ver detalles
4. En detalles:
   - Ver informacion completa
   - Obtener recomendaciones IA
   - Solicitar prestamo (si hay disponibilidad)

### 3. Mis Prestamos

1. Ver prestamos activos y vencidos
2. Ver historial de libros devueltos
3. Devolver libro (actualiza disponibilidad)

### 4. Reglas de Biblioteca (Admin)

1. Ver reglas actuales (dias de prestamo, maximo de libros)
2. Editar reglas (solo administrador)

### 5. Gestion de Libros (Admin)

1. Ver lista de todos los libros
2. Crear nuevo libro
3. Editar libro existente
4. Eliminar libro (con confirmacion)

### 6. Metricas (Admin)

1. Ver total de prestamos
2. Ver prestamos activos
3. Ver prestamos vencidos
4. Ver libros devueltos
5. Ver prestamos por usuario
6. Ver historial completo de prestamos

### 7. Chat IA

1. Boton flotante en esquina inferior derecha
2. Preguntas sobre libros, generos o recomendaciones
3. Respuestas generadas por Google Gemini AI

---

## Configuracion

### Variables de Entorno (.env)

```env
# Supabase (opcional - sin estas variables usa mocks)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Google Gemini AI (opcional - sin esta variable usa respuestas demo)
VITE_GEMINI_API_KEY=
```

### Modo Demo (sin configuracion)
- Usa datos de `src/mocks/*.json`
- IA responde con recomendaciones predefinidas
- Autenticacion simulada

### Modo Produccion
- Configurar Supabase para persistencia de datos
- Configurar Gemini API para recomendaciones reales

---

## Tech Stack

- **Frontend**: Vue.js 3 (Composition API)
- **Build Tool**: Vite
- **Routing**: Vue Router
- **State Management**: Pinia
- **Backend**: Supabase (opcional)
- **IA**: Google Gemini AI (opcional)
- **Estilos**: CSS con Custom Properties (agnostico)

---

## Ejecucion

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para produccion
npm run build
```

Acceso: `http://localhost:5173`

---

## Estructura de Datos

### Libro
```json
{
  "id": "book-1",
  "titulo": "El Senor de los Anillos",
  "autor": "J.R.R. Tolkien",
  "isbn": "978-0-618-64015-7",
  "genero": "Fantasia",
  "descripcion": "Una epica historia de aventura...",
  "portada": "https://...",
  "unidades_totales": 3,
  "unidades_disponibles": 2,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Prestamo
```json
{
  "id": "loan-1",
  "libro_id": "book-1",
  "usuario_id": "user-2",
  "fecha_prestamo": "2024-05-01T10:00:00Z",
  "fecha_devolucion_esperada": "2024-05-15T10:00:00Z",
  "fecha_devolucion_real": null,
  "estado": "activo",
  "created_at": "2024-05-01T10:00:00Z"
}
```

### Reglas
```json
{
  "id": "rules-1",
  "dias_prestamo": 14,
  "max_libros_simultaneos": 3,
  "updated_at": "2024-01-01T00:00:00Z",
  "updated_by": "user-1"
}
```
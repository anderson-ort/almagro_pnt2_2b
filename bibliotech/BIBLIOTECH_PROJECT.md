# BiblioTech - Sistema de Gestión de Biblioteca

## Propósito de la Aplicación

BiblioTech es una plataforma web diseñada para gestionar de manera eficiente las operaciones de una biblioteca, facilitando el control de préstamos, inventario y acceso a la información tanto para lectores como para administradores.

### Problemas que Resuelve
- **Trazabilidad de préstamos**: Seguimiento completo del historial de préstamos por usuario y libro
- **Control de inventario**: Gestión de disponibilidad y unidades de libros
- **Acceso a información**: Portal centralizado para consultar catálogo y reglas de la biblioteca
- **Recomendaciones inteligentes**: Sugerencias de lectura basadas en IA

---

## Perfiles de Usuario

### Lector
- Consultar catálogo de libros disponibles
- Solicitar préstamos (según reglas establecidas)
- Ver historial personal de préstamos
- Recibir recomendaciones de libros mediante IA
- Consultar reglas de la biblioteca

### Administrador
- Todas las funcionalidades del lector
- CRUD completo de libros (crear, editar, eliminar)
- Gestionar reglas de la biblioteca (días de préstamo, límite de libros)
- Ver métricas y estadísticas (total de préstamos, por usuario, historial general)
- Gestionar préstamos de todos los usuarios

---

## Estructura de Datos (Schemas)

### Libros
```javascript
{
  id: string,
  titulo: string,
  autor: string,
  isbn: string,
  genero: string,
  descripcion: string,
  portada: string, // URL de imagen
  unidades_totales: number,
  unidades_disponibles: number,
  created_at: timestamp
}
```

### Préstamos
```javascript
{
  id: string,
  libro_id: string,
  usuario_id: string,
  fecha_prestamo: timestamp,
  fecha_devolucion_esperada: timestamp,
  fecha_devolucion_real: timestamp | null,
  estado: 'activo' | 'devuelto' | 'vencido',
  created_at: timestamp
}
```

### Recomendaciones (Cache)
```javascript
{
  libro_id: string,
  recomendaciones: [
    {
      titulo: string,
      razon: string,
      relevancia: number
    }
  ],
  timestamp: timestamp,
  ttl: number // tiempo de vida del cache
}
```

### Reglas de Biblioteca
```javascript
{
  id: string,
  dias_prestamo: number,
  max_libros_simultaneos: number,
  updated_at: timestamp,
  updated_by: string // usuario_id del admin
}
```

---

## Páginas y Funcionalidades

### 1. Login / Registro
- Formulario de autenticación
- Registro de nuevos lectores
- Redirección según rol de usuario

### 2. Catálogo de Libros
- Grid/lista de libros disponibles
- Filtros por género, autor, disponibilidad
- Vista detallada de cada libro
- Botón de préstamo (solo usuarios autenticados)
- Recomendaciones IA al seleccionar un libro

### 3. Reglas de la Biblioteca
- Vista pública de las reglas actuales
- Formulario de edición (solo administrador)
- Historial de cambios en reglas

### 4. Métricas (Solo Administrador)
- Total de libros prestados
- Préstamos por usuario
- Historial completo de préstamos
- Gráficos simples de actividad

### 5. Gestión de Libros (Solo Administrador)
- Tabla con listado completo
- Formulario para crear libro
- Edición inline o modal
- Control de unidades disponibles
- Eliminación con confirmación

### 6. Chat/Consultas IA
- Input flotante o en sidebar (solo usuarios autenticados)
- Integración con Gemini AI para consultas sobre libros
- Respuestas formateadas y amigables
- Oculto para usuarios no autenticados

---

## Stack Tecnológico

- **Frontend**: Vue.js 3 (Composition API)
- **Build Tool**: Vite
- **Routing**: Vue Router
- **State Management**: Pinia (para cache de recomendaciones)
- **Backend**: Supabase (Auth, Database, Storage)
- **IA**: Google Gemini AI (genai dependency)
- **Styling**: CSS/TailwindCSS (sugerido para rapidez)

---

## Arquitectura Propuesta

```
src/
├── assets/          # Imágenes, estilos globales
├── components/      # Componentes reutilizables
│   ├── BookCard.vue
│   ├── BookForm.vue
│   ├── LoanTable.vue
│   └── AIChat.vue
├── views/           # Páginas principales
│   ├── LoginView.vue
│   ├── CatalogView.vue
│   ├── RulesView.vue
│   ├── MetricsView.vue
│   └── AdminBooksView.vue
├── stores/          # Pinia stores
│   ├── auth.js
│   ├── books.js
│   ├── loans.js
│   └── recommendations.js
├── services/        # Lógica de negocio
│   ├── supabase.js
│   ├── gemini.js
│   └── api.js
├── router/          # Configuración de rutas
│   └── index.js
├── mocks/           # Datos de prueba (fase inicial)
│   ├── books.json
│   ├── loans.json
│   └── users.json
└── utils/           # Funciones auxiliares
    ├── dateHelpers.js
    └── validators.js
```

---

## Flujo de Datos Simplificado

### Cache de Recomendaciones (Pinia)
```javascript
// stores/recommendations.js
export const useRecommendationsStore = defineStore('recommendations', {
  state: () => ({
    cache: new Map() // libro_id -> { data, timestamp }
  }),
  actions: {
    async getRecommendations(libroId) {
      const cached = this.cache.get(libroId)
      const TTL = 1000 * 60 * 60 // 1 hora
      
      if (cached && Date.now() - cached.timestamp < TTL) {
        return cached.data
      }
      
      const data = await fetchFromGemini(libroId)
      this.cache.set(libroId, { data, timestamp: Date.now() })
      return data
    }
  }
})
```

---

## Fases de Desarrollo

### Fase 1: Mocks y Estructura
- Configurar proyecto Vite + Vue + Router + Pinia
- Crear mocks de datos en JSON
- Diseñar componentes base sin funcionalidad
- Implementar rutas y navegación básica

### Fase 2: Funcionalidad Core
- Sistema de autenticación (mock inicial)
- CRUD de libros con datos mock
- Sistema de préstamos básico
- Cache de recomendaciones con Pinia

### Fase 3: Integración Supabase
- Migrar mocks a Supabase
- Implementar autenticación real
- Conectar todas las operaciones CRUD
- Row Level Security policies

### Fase 4: IA y Refinamiento
- Integrar Gemini AI para recomendaciones
- Chat de consultas inteligente
- Pulir UI/UX
- Testing y correcciones

---

## Consideraciones Técnicas

### Gestión de Unidades
- Un libro puede tener múltiples unidades físicas
- `unidades_disponibles` se actualiza con cada préstamo/devolución
- No permitir préstamos si `unidades_disponibles === 0`

### Reglas de Negocio
- Un lector no puede prestar más libros que el `max_libros_simultaneos`
- La `fecha_devolucion_esperada` se calcula automáticamente: `fecha_prestamo + dias_prestamo`
- Los préstamos vencidos deben marcarse automáticamente

### Seguridad
- Rutas de administrador protegidas con guards
- Validación de permisos en Supabase con RLS
- Sanitización de inputs en formularios

# Pinia y Persistencia de Estado

## ¿Qué es Pinia?

Pinia es la biblioteca oficial de gestión de estado global para Vue 3. Reemplazó a Vuex y se integra de forma nativa con la Composition API, ofreciendo una experiencia más simple, tipada y modular.

En esencia, una **store** de Pinia es un contenedor reactivo que mantiene datos y lógica, accesible desde cualquier componente sin necesidad de prop drilling. Internamente utiliza el sistema de reactividad de Vue (`ref`, `computed`) y garantiza que el estado sea un **singleton**: todos los componentes que consumen la misma store comparten exactamente la misma instancia.

## Conceptos clave

| Concepto      | Analogía Vue            | Descripción                                                                 |
|---------------|-------------------------|-----------------------------------------------------------------------------|
| **State**     | `ref()`                 | Datos reactivos que definen el estado central.                              |
| **Getters**   | `computed()`            | Valores derivados del estado, calculados bajo demanda y cacheados.         |
| **Actions**   | Funciones               | Métodos que contienen lógica de negocio y pueden ser asíncronos. Mutan el state directamente (no hay mutaciones separadas como en Vuex). |

Con la Composition API se escriben como una función que retorna las propiedades y métodos, resultando en un código familiar y altamente legible.

## ¿Para qué sirve?

- **Compartir estado entre componentes no relacionados** (navbar, carrito, perfil, etc.).
- **Centralizar lógica de autenticación** (usuario, sesión, permisos).
- **Mantener datos que deben sobrevivir a cambios de ruta** (filtros, configuración).
- **Simplificar el testing**: la store se puede instanciar y simular fácilmente.
- **Facilitar la integración con herramientas de desarrollo** (Vue DevTools muestra el estado en tiempo real).

## Ventajas en proyectos de mediano calibre

1. **Eliminación del prop drilling** – Evita pasar datos a través de múltiples capas de componentes que no los necesitan.
2. **Código más mantenible** – La lógica de negocio se concentra en stores, no dispersa en componentes.
3. **Mejor organización** – Separa claramente el estado global del estado local de UI.
4. **Reactividad consistente** – Al usar `ref`/`computed`, el comportamiento es idéntico al de un componente.
5. **Escalabilidad** – Añadir nuevas funcionalidades (carrito, favoritos, temas) se vuelve tan simple como crear una nueva store.
6. **TypeScript amigable** – Tipado completo sin configuración adicional.
7. **Vue DevTools** – Inspección en tiempo real del estado de cada store, facilitando debugging.

## Pros y contras de Pinia

### Pros
- API minimalista y directa (mucho más simple que Vuex).
- No requiere módulos anidados: cada store es independiente.
- Soporta hot module replacement (HMR) en desarrollo.
- Excelente integración con el ecosistema Vue 3 (router, composables).
- Comunidad activa y mantenimiento oficial por el core team de Vue.

### Contras
- Añade una dependencia al proyecto (aunque mínima).
- Puede llevar a sobre-ingeniería si se abusa: no todo el estado debe ser global.
- La persistencia automática (plugin) puede inducir a guardar datos sensibles por descuido.
- Para aplicaciones muy pequeñas (pocos componentes, sin estado compartido) puede ser innecesaria.

## Pinia y chats con IA (asistentes de código)

Cuando trabajás con herramientas como ChatGPT, Copilot o Cursor, usar Pinia mejora la colaboración:

1. **Contexto único y explícito** – La store define contratos claros (métodos, propiedades). La IA puede entender rápidamente cómo se estructura el estado sin perderse entre componentes.
2. **Menos ambigüedad** – Un prompt como *“Agregá un botón que llame a `useCartStore().agregarProducto`”* es preciso y no requiere explicar cómo se pasa el dato por props.
3. **Refactorización más segura** – Si la IA modifica la store, los cambios se propagan automáticamente a todos los consumidores, reduciendo errores de inconsistencia.
4. **Generación de código dirigida** – Podés pedirle a la IA que genere una store completa con `defineStore` y luego auditarla, como ya hiciste en el ejercicio de favoritos.

En resumen, Pinia actúa como **capa de abstracción documentada** que la IA puede interpretar y extender sin necesidad de ver toda la aplicación.

## Persistencia de estado con `pinia-plugin-persistedstate`

### ¿Qué es?
Un plugin que guarda automáticamente el estado de una store en `localStorage` (o `sessionStorage`, cookies, etc.) y lo restaura al iniciar la aplicación. Se configura por store, e incluso permite seleccionar qué campos persistir.

### ¿Para qué sirve?
- Mantener la sesión de usuario entre recargas (aunque para tokens de auth es mejor usar el manejo nativo de Supabase).
- Conservar preferencias de UI (tema oscuro/claro, idioma).
- Recordar datos de un carrito de compras o lista de favoritos sin necesidad de backend.

### ¿Cómo funciona?
- Al declarar `persist: true` en las opciones de `defineStore`, el plugin serializa todo el state (o las keys indicadas) en `localStorage`.
- Al recargar la página, el plugin lee el almacenamiento y restaura los valores reactivos antes de que la app se renderice.
- La sincronización es automática: cada vez que cambia el estado, se escribe en el storage.

### Pros y contras de la persistencia automática

| Pros                                                         | Contras                                                          |
|--------------------------------------------------------------|------------------------------------------------------------------|
| Implementación trivial (una línea de configuración).          | Puede almacenar datos sensibles sin intención.                   |
| Mejora la experiencia de usuario al evitar pérdida de datos. | El tamaño de localStorage está limitado (5–10 MB).               |
| Totalmente configurable (pick, omit, storage personalizado). | No es adecuado para información que necesita ser validada por servidor. |
| Mantiene la reactividad: cambios en el state se reflejan instantáneamente. | Si la estructura del estado cambia, datos antiguos pueden causar errores al restaurar. |

### Seguridad y buenas prácticas de persistencia

- **Nunca persistir tokens de autenticación o información sensible** (contraseñas, datos de pago). Para eso, usá el manejo de sesión del backend (cookies seguras, httpOnly).
- **Usá `pick` para seleccionar solo lo necesario**:
  ```js
  persist: {
    pick: ['user'] // solo guarda el objeto user, no loading/error
  }
  ```
- **Considerá el ciclo de vida**: si guardás datos que pueden caducar (carrito con precios), actualizalos al iniciar la app.
- **Configurá un key único por store** para evitar colisiones.
- **No persistir estado efímero** (loading, errores temporales). Para eso podés usar `omit`.

## Buenas prácticas generales con Pinia

- **Una store por dominio**: `useAuthStore`, `useCartStore`, `useFavoritesStore`, no una sola “appStore” gigante.
- **Mantener las stores planas**: evitá stores anidadas; si una store necesita datos de otra, importala directamente.
- **No mutar el state desde componentes**: usá siempre las actions para mantener la lógica encapsulada.
- **Inicializá escuchas globales (como `onAuthStateChange`) en el entry point** (`App.vue` o `main.js`), no en componentes.
- **Evitá la dependencia circular**: si dos stores se referencian mutuamente, extraé la lógica común a un composable o reevalúa el diseño.
- **Usá las DevTools**: durante el desarrollo, la pestaña Pinia te muestra el estado en tiempo real, permite editar valores y viajar en el tiempo de las mutaciones.

## Cuándo usar Pinia vs. estado local vs. composables

| Escenario                                                                 | Solución recomendada                     |
|---------------------------------------------------------------------------|------------------------------------------|
| Datos que solo usa un componente y sus hijos directos.                    | Estado local (`ref`, `reactive`).        |
| Lógica reutilizable sin estado compartido (ej. formateo de fechas).       | Composable simple (función).             |
| Estado que necesitan dos o más componentes no relacionados.               | **Pinia store**.                         |
| Estado que debe persistir entre navegaciones (rutas).                     | Pinia store (con persistencia opcional). |
| Múltiples instancias independientes del mismo tipo de estado (ej. varios tabs con formularios). | Estado local o un composable que retorne una nueva instancia cada vez. |
| Lógica de autenticación, carrito de compras, configuración global.        | Pinia store (singleton).                 |

## Conclusión

Pinia es la herramienta canónica para el estado global en Vue 3, que brilla en proyectos de mediana escala donde la complejidad de compartir datos empieza a doler. Su diseño simple, la integración con la Composition API y el soporte oficial la hacen una elección segura. Complementado con el plugin de persistencia, resuelve elegantemente la mayoría de las necesidades de almacenamiento local, siempre que se aplique con conciencia de seguridad y buenas prácticas.
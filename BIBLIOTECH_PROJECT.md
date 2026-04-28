## Proyecto a realizar en clase: BiblioTech

El proyecto consiste en el diseño y desarrollo de una plataforma web para la gestión integral de una biblioteca. El sistema busca resolver problemas de trazabilidad en préstamos, control de inventario y acceso a la información para dos perfiles de usuario: lectores y administradores.

### Estrategia de Producto
El desarrollo se rige bajo la filosofía de mejora continua, partiendo de una Prueba de Concepto (POC) para validar la interfaz, avanzando hacia un Producto Mínimo Viable (MVP) funcional y culminando en una aplicación escalable con procesos de integración continua.

---

## Clase 1 — Kickoff y Vue Core
### Fundamentos y Estrategia de Lanzamiento
Se establece la base del proyecto analizando las necesidades del negocio. Se define qué funcionalidades son críticas para el lanzamiento inicial y cuáles formarán parte de futuras iteraciones.

* **Análisis de Negocio:** Diferenciación entre POC (validación técnica) y MVP (valor para el usuario).
* **Gestión de Versiones:** Introducción al flujo de trabajo profesional mediante ramas de Git y Pull Requests.
* **Reactividad Base:** Comprensión de cómo la interfaz responde a los cambios de datos de forma automática.

## Clase 2 — Componentes y Composables
### Arquitectura de UI y Reutilización de Lógica
Enfoque en la modularización. El sistema se divide en piezas pequeñas y reutilizables para garantizar la mantenibilidad a largo plazo.

* **Responsabilidad Única:** Separación de la interfaz visual de la lógica de negocio.
* **Comunicación Unidireccional:** Gestión de cómo fluyen los datos desde los componentes padres hacia los hijos y cómo se notifican los eventos hacia arriba.
* **Lógica Desacoplada:** Uso de funciones especializadas para cálculos complejos como vencimientos y disponibilidad.

## Clase 3 — Vue Router
### Navegación y Experiencia de Usuario
Transformación de la aplicación en una Single Page Application (SPA) para ofrecer una navegación fluida sin recargas de página.

* **Estrategia de Navegación:** Definición de rutas estáticas y dinámicas (ej. fichas individuales de libros).
* **Protección de Accesos:** Implementación de guardias de navegación para asegurar que solo usuarios autorizados accedan al panel de administración.
* **Usabilidad:** Manejo de parámetros de búsqueda y filtros mediante la URL.

## Clase 4 — Pinia
### Gestión de Estado Global y Arquitectura de Datos
Resolución de la complejidad en aplicaciones grandes mediante un almacén central de datos, evitando la transferencia excesiva de información entre componentes distantes.

* **Estado Centralizado:** Gestión de la sesión del usuario y el carrito de préstamos desde un único punto de verdad.
* **Persistencia de Datos:** Estrategias para que la información no se pierda al actualizar el navegador.
* **Arquitectura de Datos:** Diferenciación entre estado local (de componente) y estado global (de aplicación).

## Clase 5 — Consumo de API y Autenticación
### Integración con Backend como Servicio (BaaS)
Conexión de la interfaz con una base de datos real y un sistema de seguridad profesional, eliminando el uso de datos simulados.

* **Servicios Externos:** Integración con plataformas de backend que gestionan la seguridad y persistencia sin necesidad de infraestructura propia.
* **Flujos de Acceso:** Diseño de procesos de registro, inicio de sesión y gestión de sesiones mediante tokens.
* **Seguridad en el Cliente:** Manejo ético y seguro de las claves de acceso y la información sensible del usuario.

## Clase 6 — Deploy y CI/CD
### Automatización y Entornos de Producción
Finalización del ciclo de desarrollo mediante la puesta en producción del sistema bajo estándares profesionales de automatización.

* **Integración Continua (CI):** Automatización de pruebas y validaciones antes de integrar cambios al proyecto principal.
* **Despliegue Continuo (CD):** Publicación automática de la aplicación en servidores reales tras la aprobación de cambios.
* **Variables de Entorno:** Gestión segura de configuraciones para distintos entornos (desarrollo vs. producción).

---

## Tabla de Seguimiento de Desarrollo

| Tarea / Hito | Clase Relacionada | Entregable Esperado | Estado Sugerido |
| :--- | :---: | :--- | :--- |
| Definición de MVP y Setup | Clase 1 | Repositorio inicial y estructura de carpetas | Pendiente |
| Creación de componentes base | Clase 1 | Tarjetas de libros y contadores de stock | Pendiente |
| Modularización de lógica | Clase 2 | Composables de fechas y validaciones | Pendiente |
| Configuración de navegación | Clase 3 | Mapa de rutas y vistas principales | Pendiente |
| Implementación de seguridad frontal | Clase 3 | Navigation Guards para Admin | Pendiente |
| Almacén de datos global | Clase 4 | Stores de usuario y préstamos activos | Pendiente |
| Sincronización con Backend | Clase 5 | Conexión a base de datos real | Pendiente |
| Sistema de Autenticación | Clase 5 | Pantallas de Login y Registro funcionales | Pendiente |
| Pipeline de Automatización | Clase 6 | Workflow de GitHub Actions configurado | Pendiente |
| Lanzamiento a Producción | Clase 6 | URL pública del proyecto funcionando | Pendiente |
## 1. Plataforma de Gestión de Mentorías (MentorMatch)
### Descripcion del proyecto
Este proyecto aborda la dificultad de conectar estudiantes con mentores de forma organizada. La solución frontend permite visualizar un catálogo dinámico de mentores mediante **componentes reutilizables** que reciben información por props. Utiliza **Vue Router** para navegar entre la lista general y el perfil detallado de cada mentor mediante rutas dinámicas. La gestión de las citas y la selección del mentor se centraliza en una **store de Pinia**, lo que permite que el usuario mantenga su selección incluso si navega por diferentes secciones, aplicando persistencia para no perder los datos al recargar. Se incluyen **unit tests** para asegurar que la lógica de reserva de turnos no permita duplicados.

*Dificultad técnica: Media*

## 2. Dashboard de Seguimiento de Finanzas Personales
### Descripcion del proyecto
Resuelve el caos en el registro de gastos e ingresos diarios. La aplicación utiliza **composables** para encapsular la lógica de cálculos matemáticos y el formateo de monedas, manteniendo los componentes de la interfaz limpios y enfocados en la UI. Implementa **Navigation Guards** en el router para simular un acceso protegido a las estadísticas privadas. El estado global con **Pinia** maneja el balance total y el historial, mientras que el flujo de trabajo se asegura mediante un **pipeline de CI/CD** que valida que cada nueva funcionalidad añadida (como un filtro de fechas) no rompa los cálculos existentes antes de desplegarse automáticamente a producción.

*Dificultad técnica: Media-Alta*

## 3. Catálogo de Expediciones Turísticas (EcoTravel)
### Descripcion del proyecto
Soluciona la falta de interactividad en las agencias de viajes tradicionales. El frontend destaca por el uso de **slots** para crear tarjetas de expedición flexibles que pueden mostrar diferentes tipos de contenido (video, galerías o alertas de "últimos cupos"). La lógica de búsqueda y filtrado por dificultad o destino se gestiona con **propiedades computadas** reactivas. Para garantizar la calidad, se aplican pruebas de integración con **Vitest** que verifican la interacción entre los componentes de filtrado y la lista de resultados. El proyecto final reside en una URL real tras pasar por un flujo de **Code Review** y automatización mediante GitHub Actions.

*Dificultad técnica: Media*

## 4. Sistema de Inventario para Coleccionistas
### Descripcion del proyecto
Resuelve la pérdida de trazabilidad en colecciones extensas (discos, libros o figuras). Implementa un flujo de **Git Flow** profesional para desarrollar funcionalidades por separado, como la carga de imágenes o el sistema de etiquetas. Utiliza **v-model** personalizado para componentes de entrada de datos complejos. La arquitectura se apoya en una **store de Pinia** que categoriza los objetos y permite realizar búsquedas instantáneas. El despliegue está configurado para que cualquier cambio en la rama principal sea verificado por tests automatizados, asegurando que el inventario siempre sea accesible y funcional para el usuario final.

*Dificultad técnica: Alta*

---

### Formato sugerido para la entrega de estos proyectos:

Para que estos proyectos cumplan con un estándar profesional, deben estructurarse siguiendo este esquema:

1.  **Arquitectura de Carpetas:** Separación clara entre `components/`, `composables/`, `stores/` y `views/`.
2.  **Documentación (README):** Explicación de los **secrets** de GitHub necesarios para el deploy y guía de instalación.
3.  **Calidad de Código:** Implementación de al menos un **test unitario** por cada lógica de negocio crítica (en la store o composables).
4.  **Automatización:** Presencia de una carpeta `.github/workflows/` con archivos YAML para CI (integración continua) y CD (despliegue continuo).
5.  **Estado Global:** Uso de Pinia para cualquier dato que deba compartirse entre más de dos niveles de componentes, evitando el *prop drilling*.


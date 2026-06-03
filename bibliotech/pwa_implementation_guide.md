# Guía de Integración PWA en BiblioTech

> [!NOTE]
> **Estado de la Integración**: ¡Completada con éxito! La configuración del plugin `vite-plugin-pwa` ha sido instalada, configurada y verificada mediante un build de producción exitoso.

Este documento describe la factibilidad y proporciona el paso a paso para añadir una capa de **PWA (Progressive Web App)** en el proyecto utilizando el plugin oficial [vite-plugin-pwa](https://vite-pwa-org.netlify.app/guide/).

---

## 1. Factibilidad y Compatibilidad del Proyecto

Tras analizar la configuración actual en [vite.config.js](file:///home/ander/ort/almagro_pnt2_2b/bibliotech/vite.config.js) y la estructura del proyecto descrita en [README.md](file:///home/ander/ort/almagro_pnt2_2b/bibliotech/README.md), el proyecto cumple perfectamente con las condiciones para utilizar la capa de PWA:

* **Herramienta de Construcción**: Usa **Vite 6.0.3**, el cual es soportado nativamente por la versión actual de `vite-plugin-pwa`.
* **Framework**: Usa **Vue 3.5.13**, para el cual `vite-plugin-pwa` provee integraciones dedicadas como `virtual:pwa-register/vue`.
* **Mocks Locales**: La existencia de datos de prueba en la carpeta [mocks](file:///home/ander/ort/almagro_pnt2_2b/bibliotech/src/mocks) facilita la implementación de una experiencia offline excelente, puesto que la app puede funcionar localmente sin depender de servidores si se cae la conexión.

---

## 2. Tabla de Pros y Contras

A continuación se detallan las ventajas y desventajas de agregar esta característica al proyecto:

| Pros (Ventajas) | Contras (Desventajas) |
| :--- | :--- |
| **Instalabilidad**: Permite a los usuarios instalar BiblioTech como una aplicación de escritorio o móvil directamente desde el navegador, con su propio icono en el menú. | **Dependencia de Red Externa**: Funcionalidades clave como la integración de IA mediante Google Gemini o la base de datos Supabase no funcionarán offline a menos que se implementen fallbacks manuales. |
| **Carga Instantánea (Cacheado)**: Almacena en caché los assets estáticos (HTML, JS, CSS, fuentes e imágenes) mediante Service Workers, reduciendo drásticamente los tiempos de carga inicial. | **Complejidad en el Manejo de Caché**: Depurar problemas relacionados con actualizaciones obsoletas (estilo "stale-while-revalidate") puede confundir al usuario o requerir lógica adicional de aviso. |
| **Modo Demo 100% Offline**: Los archivos JSON simulados en [mocks](file:///home/ander/ort/almagro_pnt2_2b/bibliotech/src/mocks) se pueden precachar automáticamente, garantizando que el modo demo funcione completamente sin internet. | **Configuración de Iconos Obligatoria**: Se requiere generar múltiples tamaños de icono (`192x192`, `512x512` y maskables) para pasar las validaciones de Lighthouse y de navegadores. |
| **Integración Transparente**: No requiere alterar la lógica de negocio actual ni reescribir componentes existentes. | **Almacenamiento Local**: Consume espacio de almacenamiento en el dispositivo cliente para los assets cacheados (aunque es mínimo para esta aplicación). |

---

## 3. Paso a Paso para la Incorporación (Sin Modificaciones Inmediatas)

Sigue estos pasos detallados para agregar la PWA al proyecto sin alterar el funcionamiento actual de la aplicación:

### Paso 1: Instalar la Dependencia de Desarrollo
Ejecuta el siguiente comando en tu terminal para añadir el plugin oficial:
```bash
npm install -D vite-plugin-pwa
```

### Paso 2: Crear el Directorio de Recursos Públicos
El proyecto no cuenta actualmente con un directorio `public/` en la raíz. Es necesario crearlo para alojar los assets estáticos que el navegador y el manifest necesitan cargar directamente:
1. Crea una carpeta llamada `public` en la raíz del proyecto.
2. Coloca en ella los iconos requeridos para tu PWA:
   * `favicon.svg` (icono general)
   * `pwa-192x192.png` (pantallas pequeñas / Android)
   * `pwa-512x512.png` (pantallas grandes / Splash Screens)

### Paso 3: Configurar [vite.config.js](file:///home/ander/ort/almagro_pnt2_2b/bibliotech/vite.config.js)
Modifica el archivo de configuración de Vite para importar e inicializar el plugin. Aquí tienes un ejemplo de cómo quedaría la estructura (manteniendo los plugins existentes intactos):

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate', // Registra y actualiza el Service Worker automáticamente en segundo plano
      includeAssets: ['favicon.svg'], // Archivos adicionales en la carpeta public que deben cachearse
      manifest: {
        name: 'BiblioTech - Gestión de Biblioteca',
        short_name: 'BiblioTech',
        description: 'Plataforma web para gestión de biblioteca con IA integrada',
        theme_color: '#3b82f6', // Color principal de la aplicación (e.g. Tailwind blue-500)
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // Permite recortar el icono de forma segura en dispositivos Android
          }
        ]
      }
    })
  ]
})
```

> [!NOTE]
> La opción `registerType: 'autoUpdate'` inyecta de forma invisible el código de registro en tu aplicación sin necesidad de que modifiques el archivo [main.js](file:///home/ander/ort/almagro_pnt2_2b/bibliotech/src/main.js).

### Paso 4: Ajustar [index.html](file:///home/ander/ort/almagro_pnt2_2b/bibliotech/index.html)
Para asegurar el correcto renderizado y comportamiento de la PWA en todos los sistemas operativos (especialmente iOS), se recomienda incluir las siguientes etiquetas `<meta>` dentro del `<head>` en tu [index.html](file:///home/ander/ort/almagro_pnt2_2b/bibliotech/index.html):

```html
<head>
  <!-- ...otros tags... -->
  <meta name="theme-color" content="#3b82f6" />
  <link rel="apple-touch-icon" href="/pwa-192x192.png" />
</head>
```

### Paso 5: Probar la Implementación Localmente
Los Service Workers no suelen ejecutarse durante el desarrollo con `npm run dev` para evitar problemas de caché en caliente. Para probar el correcto funcionamiento de tu PWA:
1. Construye el proyecto para producción:
   ```bash
   npm run build
   ```
2. Corre una previsualización del servidor de producción local:
   ```bash
   npm run preview
   ```
3. Accede a la URL indicada (habitualmente `http://localhost:4173`).
4. Abre la consola de desarrollador (F12) de tu navegador, ve a la pestaña **Application** (Aplicación) y verifica bajo **Service Workers** y **Manifest** que el registro y los datos sean correctos. Verás que aparecerá el botón de instalación en la barra de direcciones del navegador.

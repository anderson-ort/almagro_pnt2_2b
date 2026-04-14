# Clase 6 — Deploy: CI/CD y Automatización con IA
**Calendario:** GitHub Actions, pipelines de CI/CD y deploy automatizado asistido por IA

> **Tipo:** Práctica técnica + Flujo profesional · **Duración:** ~90 min  
> **Prerequisitos:** Clases 1–5 completadas, proyecto con tests funcionando, cuenta en GitHub

---

## Guía para el Docente

### Objetivo de la clase
Que los estudiantes terminen la clase con su proyecto en producción y un pipeline que corra los tests automáticamente ante cada PR y haga deploy al mergear a `main`. El proyecto del módulo tiene que vivir en una URL real al final de la clase.

### Flujo sugerido

| Tiempo | Actividad |
|--------|-----------|
| 0–10 min | Motivación: el deploy manual. Subir archivos por FTP, correr scripts a mano, no saber si los tests pasaron. Contrastar con: cada PR tiene un check verde o rojo antes de mergear, y cada push a `main` despliega solo. |
| 10–20 min | Conceptos de CI/CD. La conexión con lo ya visto: el pipeline es un guardián del flujo de PRs que practicaron en la clase 5. |
| 20–35 min | Anatomía de un workflow de GitHub Actions en vivo: `on`, `jobs`, `steps`, `uses`, `run`. Leer el YAML en voz alta — no es magia, es un script con estructura. |
| 35–50 min | Crear el workflow de CI en vivo: correr `npm run test` y `npm run build` ante cada PR. Ver el check verde/rojo en la pestaña "Actions". |
| 50–65 min | Usar IA para generar el workflow de deploy a Vercel (o GitHub Pages). Revisar el YAML generado paso por paso. |
| 65–78 min | Actividad práctica: deploy del proyecto (ejercicio 1 y 2). |
| 78–85 min | Variables de entorno y secrets: cómo manejar API keys sin exponerlas en el código. |
| 85–90 min | Cierre del módulo: el proyecto está en una URL real. Reflexión final. |

### Tips para el docente
- **Mostrar la pestaña "Actions" mientras el workflow corre.** Ver los pasos ejecutándose en tiempo real hace que el concepto sea concreto e inmediato.
- Si alguien no tiene cuenta en Vercel, GitHub Pages funciona perfectamente para proyectos Vite y el registro es con la misma cuenta de GitHub. Tener ambas opciones preparadas.
- El YAML puede intimidar. El truco es leerlo en voz alta con el grupo: "cuando haya un push a `main`, corré un job que instala dependencias, corre los tests, buildea y despliega". En prosa es completamente claro.
- **La IA es muy buena generando workflows** porque la sintaxis de GitHub Actions es muy estructurada. Es un caso de uso ideal para mostrar el valor de la IA en tareas repetitivas y bien definidas.
- Dedicar 5 minutos al cierre reflexivo del módulo completo. No apurarlo.

### Conceptos clave para reforzar
- **CI** (Continuous Integration): cada cambio se integra frecuentemente con tests automáticos que validan que nada se rompió.
- **CD** (Continuous Deployment): cada cambio que pasa CI va automáticamente a producción.
- **Secrets**: las API keys y tokens **nunca** van en el código — se guardan en GitHub y se inyectan como variables de entorno en el workflow.
- La diferencia entre un workflow de **CI** (corre en cada PR) y uno de **CD** (corre al mergear a `main`).

---

## Ejercicios / Actividades

### Ejercicio 1 — Workflow de CI (18 min, individual)

Crear `.github/workflows/ci.yml` que al abrir un PR hacia `main`:
1. Instale dependencias con `npm ci`
2. Corra los tests con `npm run test`
3. Buildee el proyecto con `npm run build`

Verificar abriendo un PR desde una rama de prueba. Confirmar el check verde en GitHub.

**Bonus:** hacer fallar el CI a propósito (modificar un componente para que un test falle) y observar que el check se pone rojo. Corregirlo y ver que vuelve a verde.

---

### Ejercicio 2 — Workflow de deploy con IA (25 min, individual)

Usar este prompt para generar el workflow de CD:

> *"Generá un workflow de GitHub Actions para un proyecto Vue 3 con Vite. El workflow debe: ejecutarse solo al hacer push a main; primero correr los tests con Vitest; si pasan, buildear el proyecto; hacer deploy a Vercel con vercel/action. Manejar los secrets VERCEL_TOKEN, VERCEL_ORG_ID y VERCEL_PROJECT_ID. Comentar cada sección del YAML explicando qué hace y por qué."*

Revisar el YAML generado:
- ¿Entendés qué hace cada step?
- ¿Los secrets están bien referenciados con `${{ secrets.NOMBRE }}`?
- ¿Los tests corren antes del deploy o después?

Luego configurar los secrets: GitHub → Settings → Secrets and variables → Actions.

---

### Ejercicio 3 — Variables de entorno (12 min, individual)

1. Crear `.env` con `VITE_API_URL=http://localhost:3000`
2. Agregar `.env` al `.gitignore`
3. Crear `.env.example` con las variables sin valor (documentación para el equipo)
4. Usar `import.meta.env.VITE_API_URL` en un composable
5. Agregar la variable como secret en GitHub para que el workflow la inyecte en el build

---

### Ejercicio 4 — Romper el pipeline a propósito (8 min, individual)

1. Crear rama `test/break-pipeline`
2. Cambiar el valor inicial del contador de 0 a 5 (para que el test falle)
3. Abrir PR
4. Observar que el check de CI falla y bloquea el merge
5. Corregir y ver que el check pasa

El objetivo: que vean el pipeline funcionando como guardián de calidad, no solo como automatización.

---

## Código de Ejemplo

### Workflow de CI (Pull Requests)

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main]

jobs:
  test-and-build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout código
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      # npm ci es más estricto que npm install: falla si package-lock.json no está sincronizado
      - name: Instalar dependencias
        run: npm ci

      - name: Correr tests
        run: npm run test

      # Verifica que el build no tiene errores de compilación
      - name: Build
        run: npm run build
```

### Workflow de CD (Deploy a Vercel)

```yaml
# .github/workflows/deploy.yml
name: Deploy a Producción

on:
  push:
    branches: [main]   # Solo al mergear a main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout código
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Instalar dependencias
        run: npm ci

      # Los tests también corren en el CD — no deploear código roto
      - name: Correr tests
        run: npm run test

      - name: Build
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}

      - name: Deploy a Vercel
        uses: vercel/action@v1
        with:
          vercel-token:      ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id:     ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Alternativa: GitHub Pages (sin cuenta externa)

```yaml
# .github/workflows/deploy-pages.yml
name: Deploy a GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run test
      - run: npm run build

      - name: Subir artefacto
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v4
```

```js
// vite.config.js — necesario para GitHub Pages
export default defineConfig({
  base: '/nombre-del-repo/',   // ← nombre exacto del repositorio en GitHub
  plugins: [vue()],
  test: { environment: 'jsdom', globals: true }
})
```

### Variables de entorno

```bash
# .env — desarrollo local (en .gitignore, nunca commitear)
VITE_API_URL=http://localhost:3000
VITE_APP_TITLE=Mi App Vue

# .env.example — SÍ commitear: documenta qué variables necesita el proyecto
VITE_API_URL=
VITE_APP_TITLE=
```

```js
// Uso en el código
// Solo las variables con prefijo VITE_ son accesibles en el browser
const apiUrl = import.meta.env.VITE_API_URL
const titulo = import.meta.env.VITE_APP_TITLE
const modoProduccion = import.meta.env.PROD  // boolean: true en build
```

### Prompt para generar workflows con IA

```
Contexto:
- Proyecto Vue 3 con Vite y Vitest
- Deploy destino: [Vercel / GitHub Pages]
- Node.js versión 20
- Ramas: main (producción)

Necesito dos workflows de GitHub Actions:

1. CI: se ejecuta en cada PR a main.
   Pasos: instalar con npm ci, correr tests, correr build.
   Si algún paso falla, el PR no debe poder mergearse.

2. CD: se ejecuta al hacer push a main.
   Pasos: correr el CI completo, luego deploy a [destino].
   Variable de entorno necesaria: VITE_API_URL (desde secrets).

Requisitos:
- Comentar cada step explicando qué hace y por qué
- Usar versiones fijas de los actions (no @latest)
- Cachear node_modules
- Indicar qué secrets configurar en GitHub y dónde
```

### Estructura final del proyecto

```
mi-proyecto-vue/
├── .github/
│   └── workflows/
│       ├── ci.yml          ← corre en cada PR
│       └── deploy.yml      ← corre al mergear a main
├── src/
│   ├── components/
│   ├── composables/
│   ├── router/
│   ├── stores/
│   └── views/
├── .env                    ← NO en git
├── .env.example            ← SÍ en git
├── .gitignore
├── vite.config.js
└── README.md
```

---

## Preguntas para Disparar Debate

1. **Antes de esta clase, ¿cómo imaginaban que llegaba el código de un desarrollador a producción?** ¿Qué cambió en esa imagen?

2. **El pipeline bloqueó el merge cuando los tests fallaron.** ¿Eso es una molestia o una feature? ¿Qué pasaría en un equipo de 10 personas sin ese guardián?

3. **La IA generó el workflow casi sin errores.** ¿Por qué creen que la IA es buena en esto? ¿Qué tipo de tareas de configuración son ideales para delegar y cuáles no?

4. **CI/CD cambia la frecuencia de deploys: de una vez por semana a decenas de veces por día.** ¿Eso es siempre mejor? ¿Qué riesgos introduce?

5. **Ahora tienen el proyecto en producción.** Mirando el módulo completo: ¿qué fue lo más valioso que aprendieron? ¿Qué cambió en cómo van a encarar el próximo proyecto?

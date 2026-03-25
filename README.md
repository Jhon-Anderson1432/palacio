# palace

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
# palacio
# 🎨 Galería Virtual "Palacio"

Una plataforma de exhibición de arte digital escalable y bilingüe (Español / Inglés), diseñada para gestionar y mostrar una colección de hasta 4,000 obras de arte. Optimizado para dispositivos móviles con un enfoque en la experiencia de usuario y el rendimiento visual a través de videos de alta calidad.

🔗 **Enlace en vivo:** [https://palacio-iota.vercel.app](https://palacio-iota.vercel.app)

---

## ✨ Características Principales

- **Diseño Bilingüe:** Fichas técnicas e interfaz adaptadas en Inglés y Español (Efecto espejo).
- **Catálogo Dinámico:** Grilla de exposiciones con barra de búsqueda y filtrado en tiempo real (por título, autor o técnica).
- **Optimización Móvil:** Vistas detalladas diseñadas específicamente para navegación fluida en smartphones (scroll libre, botones táctiles grandes).
- **Formatos Multimedia:** Soporte nativo para previsualización de obras en formato de video (loop, autoplay, muted).
- **Conexión Directa a Ventas:** Botones de "Consultar Adquisición" enlazados directamente a WhatsApp Business con mensajes pre-formateados.
- **Panel Administrativo:** Sistema de subida de obras protegido por autenticación.

---

## 🛠️ Stack Tecnológico

**Frontend:**
- [Vue.js 3](https://vuejs.org/) (Composition API & `<script setup>`)
- [Vite](https://vitejs.dev/) (Build tool)
- [Vue Router](https://router.vuejs.org/) (Navegación SPA)
- [Tailwind CSS](https://tailwindcss.com/) (Estilos y animaciones)

**Backend & Base de Datos:**
- [Supabase](https://supabase.com/) (PostgreSQL Database, Storage para videos y Authentication)
- **Seguridad:** Row Level Security (RLS) configurado para acceso público de lectura.

**Despliegue (Hosting):**
- [Vercel](https://vercel.com/) (CI/CD automático desde GitHub, configurado con `vercel.json` para enrutamiento SPA).

---

## 🗄️ Estructura de la Base de Datos (Supabase)

**Tabla: `obras`**
| Campo | Tipo de Dato | Descripción |
| :--- | :--- | :--- |
| `id` | UUID | Identificador único de la obra (Primary Key) |
| `titulo` | String (Text) | Nombre de la obra |
| `autor` | String (Text) | Nombre del artista |
| `tecnica` | String (Text) | Materiales / Técnica usada (Ej. Óleo, Acrílico) |
| `medidas` | String (Text) | Dimensiones de la obra |
| `precio` | Numeric | Valor de la obra en USD |
| `video_url` | String (URL) | Enlace al video almacenado en Supabase Storage |
| `created_at` | Timestamp | Fecha automática de subida |

---

## 🗺️ Estructura de Rutas (Vue Router)

- `/` : Landing Page / Inicio.
- `/exposiciones` : Catálogo completo con buscador y tarjetas bilingües.
- `/DetalleObra/:id` : Vista inmersiva de una obra específica (Optimizada para QRs).
- `/admin` : Panel de control privado para subir y gestionar el inventario.

---

## 🚀 Instalación y Desarrollo Local

Si deseas clonar y correr este proyecto de forma local:

1. **Clonar el repositorio:**
   ```bash
   git clone [URL-DE-TU-REPOSITORIO]
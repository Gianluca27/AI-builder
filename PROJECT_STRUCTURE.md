# 📁 Estructura Completa del Proyecto

## 🗂️ Árbol de Directorios

```
ai-website-builder/
│
├── 📄 README.md                          ← Documentación principal
├── 📄 QUICKSTART.md                      ← Guía de inicio rápido
├── 📄 PROJECT_STRUCTURE.md               ← Este archivo
├── 📄 .gitignore                         ← Git ignore global
├── 📄 setup-complete.sh                  ← Script de instalación automática
│
├── 📁 backend/                           ← Backend (Node.js + Express)
│   ├── 📄 package.json                   ← Dependencias backend
│   ├── 📄 .env.example                   ← Ejemplo de variables de entorno
│   ├── 📄 .env                           ← Variables de entorno (crear)
│   ├── 📄 .gitignore                     ← Git ignore backend
│   │
│   └── 📁 src/
│       ├── 📄 server.js                  ← Servidor principal Express
│       │
│       ├── 📁 config/
│       │   └── 📄 database.js            ← Configuración MongoDB
│       │
│       ├── 📁 models/
│       │   ├── 📄 User.model.js          ← Modelo de Usuario
│       │   ├── 📄 Project.model.js       ← Modelo de Proyecto
│       │   └── 📄 Template.model.js      ← Modelo de Template
│       │
│       ├── 📁 controllers/
│       │   ├── 📄 auth.controller.js     ← Controlador de autenticación
│       │   ├── 📄 ai.controller.js       ← Controlador de IA (⭐ GENERACIÓN)
│       │   ├── 📄 project.controller.js  ← Controlador de proyectos
│       │   └── 📄 template.controller.js ← Controlador de templates
│       │
│       ├── 📁 services/
│       │   └── 📄 openai.service.js      ← Servicio OpenAI GPT-4 (⭐ CORE)
│       │
│       ├── 📁 routes/
│       │   ├── 📄 auth.routes.js         ← Rutas de autenticación
│       │   ├── 📄 ai.routes.js           ← Rutas de IA
│       │   ├── 📄 project.routes.js      ← Rutas de proyectos
│       │   └── 📄 template.routes.js     ← Rutas de templates
│       │
│       ├── 📁 middleware/
│       │   ├── 📄 auth.middleware.js     ← Middleware de autenticación JWT
│       │   └── 📄 errorHandler.js        ← Manejador global de errores
│       │
│       └── 📁 scripts/
│           └── 📄 seed.js                ← Script para seedear templates
│
└── 📁 frontend/                          ← Frontend (React + Vite)
    ├── 📄 package.json                   ← Dependencias frontend
    ├── 📄 vite.config.js                 ← Configuración Vite
    ├── 📄 tailwind.config.js             ← Configuración Tailwind CSS
    ├── 📄 postcss.config.js              ← Configuración PostCSS
    ├── 📄 .env.example                   ← Ejemplo variables de entorno
    ├── 📄 .env                           ← Variables de entorno (crear)
    ├── 📄 .gitignore                     ← Git ignore frontend
    ├── 📄 index.html                     ← HTML principal
    │
    └── 📁 src/
        ├── 📄 main.jsx                   ← Entry point React
        ├── 📄 App.jsx                    ← Componente principal con routing
        ├── 📄 index.css                  ← Estilos globales + Tailwind
        │
        ├── 📁 pages/
        │   ├── 📄 LandingPage.jsx        ← Página de inicio
        │   ├── 📄 LoginPage.jsx          ← Página de login
        │   ├── 📄 RegisterPage.jsx       ← Página de registro
        │   ├── 📄 BuilderPage.jsx        ← ⭐ BUILDER PRINCIPAL (IA)
        │   ├── 📄 DashboardPage.jsx      ← Dashboard de proyectos
        │   ├── 📄 TemplatesPage.jsx      ← Galería de templates
        │   ├── 📄 PricingPage.jsx        ← Página de precios
        │   └── 📄 DocsPage.jsx           ← Documentación
        │
        ├── 📁 components/
        │   ├── 📄 Preview.jsx            ← Preview del sitio generado
        │   ├── 📄 CodeEditor.jsx         ← Editor de código (Monaco)
        │   ├── 📄 ChatMessage.jsx        ← Mensaje de chat
        │   └── 📄 SaveProjectModal.jsx   ← Modal para guardar proyecto
        │
        ├── 📁 services/
        │   └── 📄 api.js                 ← Cliente API (Axios + endpoints)
        │
        └── 📁 store/
            ├── 📄 useAuthStore.js        ← Estado global de autenticación
            └── 📄 useBuilderStore.js     ← Estado global del builder
```

---

## ✅ Checklist de Archivos

### Backend (19 archivos)

- [ ] `backend/package.json`
- [ ] `backend/.env.example`
- [ ] `backend/.gitignore`
- [ ] `backend/src/server.js`
- [ ] `backend/src/config/database.js`
- [ ] `backend/src/models/User.model.js`
- [ ] `backend/src/models/Project.model.js`
- [ ] `backend/src/models/Template.model.js`
- [ ] `backend/src/controllers/auth.controller.js`
- [ ] `backend/src/controllers/ai.controller.js`
- [ ] `backend/src/controllers/project.controller.js`
- [ ] `backend/src/controllers/template.controller.js`
- [ ] `backend/src/services/openai.service.js` ⭐
- [ ] `backend/src/routes/auth.routes.js`
- [ ] `backend/src/routes/ai.routes.js`
- [ ] `backend/src/routes/project.routes.js`
- [ ] `backend/src/routes/template.routes.js`
- [ ] `backend/src/middleware/auth.middleware.js`
- [ ] `backend/src/middleware/errorHandler.js`
- [ ] `backend/src/scripts/seed.js`

### Frontend (23 archivos)

- [ ] `frontend/package.json`
- [ ] `frontend/vite.config.js`
- [ ] `frontend/tailwind.config.js`
- [ ] `frontend/postcss.config.js`
- [ ] `frontend/.env.example`
- [ ] `frontend/.gitignore`
- [ ] `frontend/index.html`
- [ ] `frontend/src/main.jsx`
- [ ] `frontend/src/App.jsx`
- [ ] `frontend/src/index.css`
- [ ] `frontend/src/pages/LandingPage.jsx`
- [ ] `frontend/src/pages/LoginPage.jsx`
- [ ] `frontend/src/pages/RegisterPage.jsx`
- [ ] `frontend/src/pages/BuilderPage.jsx` ⭐
- [ ] `frontend/src/pages/DashboardPage.jsx`
- [ ] `frontend/src/pages/TemplatesPage.jsx`
- [ ] `frontend/src/pages/PricingPage.jsx`
- [ ] `frontend/src/pages/DocsPage.jsx`
- [ ] `frontend/src/components/Preview.jsx`
- [ ] `frontend/src/components/CodeEditor.jsx`
- [ ] `frontend/src/components/ChatMessage.jsx`
- [ ] `frontend/src/components/SaveProjectModal.jsx`
- [ ] `frontend/src/services/api.js`
- [ ] `frontend/src/store/useAuthStore.js`
- [ ] `frontend/src/store/useBuilderStore.js`

### Raíz (5 archivos)

- [ ] `README.md`
- [ ] `QUICKSTART.md`
- [ ] `PROJECT_STRUCTURE.md`
- [ ] `.gitignore`
- [ ] `setup-complete.sh`

**Total: 47 archivos**

---

## 🎯 Archivos CORE (Los más importantes)

### Backend

1. **`backend/src/services/openai.service.js`** ⭐⭐⭐

   - Integración REAL con GPT-4
   - Genera código HTML/CSS/JS
   - Función: `generateWebsiteCode()`

2. **`backend/src/controllers/ai.controller.js`** ⭐⭐

   - Maneja peticiones de generación
   - Verifica créditos
   - Guarda proyectos

3. **`backend/src/models/User.model.js`** ⭐⭐
   - Esquema de usuario
   - Sistema de créditos
   - Autenticación

### Frontend

1. **`frontend/src/pages/BuilderPage.jsx`** ⭐⭐⭐

   - Página principal del builder
   - Chat con IA
   - Editor + Preview

2. **`frontend/src/store/useBuilderStore.js`** ⭐⭐

   - Estado global del builder
   - Función `generateCode()`
   - Manejo de proyectos

3. **`frontend/src/services/api.js`** ⭐⭐
   - Cliente API completo
   - Todos los endpoints
   - Interceptores

---

## 🔑 Variables de Entorno Necesarias

### Backend (.env)

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ai-builder
JWT_SECRET=tu_secreto_aqui
OPENAI_API_KEY=sk-tu-key-aqui  ← ⭐ CRUCIAL
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📦 Dependencias Principales

### Backend

- `express` - Framework web
- `mongoose` - ODM para MongoDB
- `openai` - Cliente oficial de OpenAI ⭐
- `jsonwebtoken` - Autenticación JWT
- `bcryptjs` - Hash de passwords

### Frontend

- `react` + `react-dom` - Framework UI
- `react-router-dom` - Routing
- `zustand` - State management
- `@monaco-editor/react` - Editor de código ⭐
- `axios` - HTTP client
- `tailwindcss` - Estilos

---

## 🚀 Comandos Importantes

### Backend

```bash
npm run dev      # Desarrollo con nodemon
npm run seed     # Seedear templates de ejemplo
npm start        # Producción
```

### Frontend

```bash
npm run dev      # Desarrollo con Vite
npm run build    # Build para producción
npm run preview  # Preview del build
```

---

## 🎨 Características Implementadas

### ✅ Autenticación

- Registro de usuarios
- Login con JWT
- Protección de rutas
- Persistencia de sesión

### ✅ Generación con IA

- Integración GPT-4 REAL
- Detección automática de tipo
- Prompts inteligentes
- Sistema de créditos

### ✅ Editor

- Monaco Editor (VS Code)
- Syntax highlighting
- Edición HTML/CSS/JS
- Autocompletado

### ✅ Proyectos

- Guardar/cargar
- Dashboard
- Duplicar
- Eliminar

### ✅ Templates

- 5 templates base
- Categorías
- Sistema de uso
- Preview

---

## 📊 Flujo de Datos

```
Usuario escribe prompt
         ↓
[BuilderPage] → useBuilderStore.generateCode()
         ↓
Frontend API (axios) → POST /api/ai/generate
         ↓
[Backend] ai.controller.js
         ↓
openai.service.js → GPT-4 API
         ↓
Código HTML generado
         ↓
Respuesta al frontend
         ↓
Preview + CodeEditor actualizados
```

---

## 🔐 Seguridad Implementada

- ✅ Passwords hasheados (bcrypt)
- ✅ JWT tokens
- ✅ CORS configurado
- ✅ Rate limiting
- ✅ Helmet headers
- ✅ Validación de inputs
- ✅ Protección de rutas

---

## 📝 Notas Importantes

1. **OpenAI API Key es OBLIGATORIA** para que funcione la generación
2. MongoDB debe estar corriendo antes de iniciar el backend
3. El puerto 5000 (backend) y 5173 (frontend) deben estar libres
4. Los templates se seedean con `npm run seed` en el backend
5. Plan Free tiene 10 créditos, Pro/Enterprise ilimitados

---

## 🎯 Próximos Pasos Sugeridos

Después de instalar todo:

1. ✅ Ejecutar `npm run seed` en backend
2. ✅ Crear una cuenta en la app
3. ✅ Generar tu primer sitio
4. ✅ Explorar templates
5. ✅ Modificar código generado
6. ✅ Guardar proyecto
7. ✅ Descargar HTML

---

Este proyecto está **100% funcional y listo para producción** con generación REAL de código usando GPT-4.

¡Feliz coding! 🚀

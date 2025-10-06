# 🚀 AI Website Builder - Proyecto Completo

> Plataforma completa de generación de sitios web con IA usando **GPT-4**, **React**, **Node.js** y **MongoDB**.

## 📋 Stack Tecnológico

### Backend

- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **OpenAI GPT-4** (Generación REAL de código)
- **JWT** para autenticación
- **bcryptjs** para encriptación

### Frontend

- **React 18** + **Vite**
- **Tailwind CSS** para estilos
- **Zustand** para estado global
- **Monaco Editor** para editar código
- **React Router** para navegación
- **Axios** para peticiones HTTP

---

## 🏗️ Estructura del Proyecto

```
ai-website-builder/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── ai.controller.js
│   │   │   └── project.controller.js
│   │   ├── models/
│   │   │   ├── User.model.js
│   │   │   ├── Project.model.js
│   │   │   └── Template.model.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── ai.routes.js
│   │   │   ├── project.routes.js
│   │   │   └── template.routes.js
│   │   ├── services/
│   │   │   └── openai.service.js  ← GENERACIÓN REAL CON GPT-4
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   └── errorHandler.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Preview.jsx
│   │   │   ├── CodeEditor.jsx
│   │   │   ├── ChatMessage.jsx
│   │   │   └── SaveProjectModal.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── BuilderPage.jsx  ← PÁGINA PRINCIPAL
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── TemplatesPage.jsx
│   │   │   ├── PricingPage.jsx
│   │   │   └── DocsPage.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── store/
│   │   │   ├── useAuthStore.js
│   │   │   └── useBuilderStore.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
│
└── README.md  ← ESTE ARCHIVO
```

---

## 🚀 Instalación y Configuración

### Requisitos Previos

- Node.js 18+ ([Descargar](https://nodejs.org/))
- MongoDB ([Descargar](https://www.mongodb.com/try/download/community)) O usar MongoDB Atlas
- Cuenta en OpenAI con API Key ([Obtener aquí](https://platform.openai.com/api-keys))

---

### Paso 1: Clonar/Crear el Proyecto

```bash
# Crear directorio principal
mkdir ai-website-builder
cd ai-website-builder

# Crear subdirectorios
mkdir backend frontend
```

---

### Paso 2: Configurar Backend

```bash
cd backend

# Instalar dependencias
npm install express cors dotenv mongoose bcryptjs jsonwebtoken openai axios express-validator helmet express-rate-limit compression morgan nodemon

# Crear archivo .env
cp .env.example .env
```

Edita `backend/.env` con tus credenciales:

```env
PORT=5000
NODE_ENV=development

# MongoDB (Local)
MONGODB_URI=mongodb://localhost:27017/ai-builder

# O MongoDB Atlas (Recomendado para producción)
# MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/ai-builder

# JWT Secret (generar una clave segura)
JWT_SECRET=tu_clave_secreta_super_segura_aqui_cambiar

# OpenAI API Key (⭐ IMPORTANTE)
OPENAI_API_KEY=sk-tu-key-de-openai-aqui

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

---

### Paso 3: Configurar Frontend

```bash
cd ../frontend

# Instalar dependencias
npm install react react-dom react-router-dom axios lucide-react react-hot-toast zustand @monaco-editor/react monaco-editor

# Instalar dependencias de desarrollo
npm install -D @vitejs/plugin-react vite tailwindcss postcss autoprefixer

# Inicializar Tailwind
npx tailwindcss init -p

# Crear archivo .env
cp .env.example .env
```

Edita `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

---

### Paso 4: Ejecutar el Proyecto

#### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

Deberías ver:

```
✅ MongoDB Connected: ...
🚀 Server running on port 5000
📝 Environment: development
🌐 Frontend URL: http://localhost:5173
```

#### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

Deberías ver:

```
  VITE v5.0.0  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

### Paso 5: Abrir la Aplicación

Abre tu navegador en: **http://localhost:5173**

---

## 📖 Cómo Usar la Aplicación

### 1. Registrarte

1. Ve a `/register`
2. Crea tu cuenta (obtienes 10 créditos gratis)

### 2. Generar tu Primera Website

1. Ve a `/builder`
2. Escribe en el chat: **"Create a modern landing page for a SaaS startup"**
3. Espera 5-10 segundos
4. ¡Boom! GPT-4 genera HTML completo

### 3. Editar el Código

1. Click en tab **"Code"**
2. Edita HTML, CSS o JavaScript
3. Los cambios se reflejan en tiempo real

### 4. Descargar

1. Click en **"Download"**
2. Se descarga `website.html`
3. ¡Listo para deploy!

### 5. Guardar Proyecto

1. Click en **"Save Project"**
2. Dale un nombre
3. Accede desde **Dashboard**

---

## 🔑 Obtener OpenAI API Key

1. Ve a: https://platform.openai.com/api-keys
2. Create new secret key
3. Copia la key (empieza con `sk-...`)
4. Pégala en `backend/.env` como `OPENAI_API_KEY`

⚠️ **Importante**:

- Necesitas agregar créditos en tu cuenta OpenAI
- GPT-4 cuesta ~$0.03 por generación
- Puedes usar GPT-3.5 cambiando el modelo en `backend/src/services/openai.service.js`

---

## 🎯 Ejemplos de Prompts

```
✅ "Create a modern landing page for a SaaS startup"
✅ "Build a portfolio website with dark theme and grid layout"
✅ "Generate a dashboard with sidebar and stats cards"
✅ "Make a blog homepage with article cards"
✅ "Create an e-commerce product page"
```

---

## 🐛 Troubleshooting

### Error: "MongoServerError: connection refused"

**Solución**: MongoDB no está corriendo.

```bash
# macOS/Linux
sudo systemctl start mongod

# O usa MongoDB Atlas (recomendado)
```

### Error: "Invalid OpenAI API key"

**Solución**: Verifica tu API key en `.env`

```bash
# Debe empezar con sk-
OPENAI_API_KEY=sk-...
```

### Error: "CORS policy"

**Solución**: Verifica que frontend y backend usen las URLs correctas

```
Backend: http://localhost:5000
Frontend: http://localhost:5173
```

### Error: "Network Error" al generar

**Solución**: Backend no está corriendo

```bash
cd backend
npm run dev
```

---

## 📦 Scripts Disponibles

### Backend

```bash
npm run dev      # Desarrollo con nodemon
npm start        # Producción
```

### Frontend

```bash
npm run dev      # Desarrollo con Vite
npm run build    # Build para producción
npm run preview  # Preview del build
```

---

## 🌟 Features Implementadas

### Autenticación

- ✅ Register/Login con JWT
- ✅ Protección de rutas
- ✅ Sesiones persistentes

### Generación con IA

- ✅ GPT-4 para generar código REAL
- ✅ Detección automática de tipo de sitio
- ✅ Soporte para mejoras iterativas
- ✅ Sistema de créditos

### Editor

- ✅ Monaco Editor (mismo de VS Code)
- ✅ Syntax highlighting
- ✅ Edición en tiempo real
- ✅ HTML, CSS, JavaScript

### Proyectos

- ✅ Guardar/cargar proyectos
- ✅ Dashboard de proyectos
- ✅ Duplicar proyectos
- ✅ Eliminar proyectos

### UI/UX

- ✅ Landing page moderna
- ✅ Sistema de notificaciones (toasts)
- ✅ Loading states
- ✅ Responsive design
- ✅ Animaciones suaves

---

## 🚀 Deploy a Producción

### Backend (Render/Railway/Fly.io)

```bash
# 1. Crear cuenta en Render.com
# 2. New Web Service
# 3. Conectar repositorio
# 4. Build Command: npm install
# 5. Start Command: npm start
# 6. Agregar variables de entorno
```

### Frontend (Vercel/Netlify)

```bash
# Opción Vercel
npm i -g vercel
cd frontend
vercel

# Opción Netlify
npm run build
# Arrastra carpeta dist/ a netlify.com/drop
```

---

## 🔐 Seguridad

- ✅ Passwords hasheados con bcrypt
- ✅ JWT tokens para autenticación
- ✅ Rate limiting en endpoints
- ✅ Helmet para headers de seguridad
- ✅ CORS configurado
- ✅ Validación de inputs

---

## 💰 Sistema de Créditos

| Plan       | Créditos  | Precio  |
| ---------- | --------- | ------- |
| Free       | 10        | $0      |
| Pro        | Ilimitado | $19/mes |
| Enterprise | Ilimitado | $99/mes |

---

## 📝 TODO / Roadmap

- [ ] Password recovery
- [ ] Email verification
- [ ] Template marketplace
- [ ] Export a React/Vue
- [ ] Collaborative editing
- [ ] Version history
- [ ] Deploy integration (Vercel/Netlify)
- [ ] AI chat improvements

---

## 🤝 Contribuir

Pull requests bienvenidos!

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

MIT License - usa este proyecto como quieras!

---

## 🙏 Créditos

- OpenAI GPT-4 para generación de código
- Monaco Editor de Microsoft
- Tailwind CSS para estilos
- React ecosystem

---

## 📧 Soporte

¿Problemas? Abre un issue en GitHub

---

**¡Hecho con ❤️ y mucho ☕!**

Happy Coding! 🚀

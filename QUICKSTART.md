# ⚡ Guía de Inicio Rápido - AI Website Builder

> De 0 a generando sitios con IA en 10 minutos

---

## 🎯 Prerrequisitos Mínimos

Antes de empezar, asegúrate de tener:

- ✅ **Node.js 18+** instalado ([Descargar](https://nodejs.org/))
- ✅ **MongoDB** corriendo ([Descargar](https://www.mongodb.com/try/download/community) o usar [Atlas](https://www.mongodb.com/cloud/atlas))
- ✅ **OpenAI API Key** ([Obtener aquí](https://platform.openai.com/api-keys))

---

## 🚀 Instalación en 4 Pasos

### Paso 1: Clonar y Configurar

```bash
# Crear proyecto
mkdir ai-website-builder
cd ai-website-builder

# Crear estructura
mkdir backend frontend
```

### Paso 2: Setup Backend (5 min)

```bash
cd backend

# Copiar todos los archivos del backend aquí
# (server.js, package.json, modelos, controladores, etc.)

# Instalar dependencias
npm install

# Crear archivo .env
nano .env
```

Pega esto en `.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ai-builder
JWT_SECRET=tu_secreto_super_seguro_cambiar
OPENAI_API_KEY=sk-TU-KEY-DE-OPENAI-AQUI
FRONTEND_URL=http://localhost:5173
```

**⚠️ IMPORTANTE**: Reemplaza `OPENAI_API_KEY` con tu key real.

### Paso 3: Setup Frontend (5 min)

```bash
cd ../frontend

# Copiar todos los archivos del frontend aquí
# (src/, package.json, vite.config.js, etc.)

# Instalar dependencias
npm install

# Crear .env
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

### Paso 4: Iniciar MongoDB

```bash
# macOS con Homebrew
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
# Inicia MongoDB Compass o usa:
net start MongoDB

# O usa MongoDB Atlas (nube) - recomendado
# Cambia MONGODB_URI en backend/.env a tu connection string de Atlas
```

---

## 🎬 Ejecutar la Aplicación

### Terminal 1 - Backend

```bash
cd backend

# Opcional: Seedear templates de ejemplo
npm run seed

# Iniciar servidor
npm run dev
```

Deberías ver:

```
✅ MongoDB Connected: localhost:27017
🚀 Server running on port 5000
📝 Environment: development
```

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

Deberías ver:

```
  VITE v5.0.0  ready in 500 ms
  ➜  Local:   http://localhost:5173/
```

---

## 🎉 ¡Listo! Probemos

1. **Abre tu navegador**: http://localhost:5173

2. **Regístrate**:

   - Click en "Get Started"
   - Crea tu cuenta (recibes 10 créditos gratis)

3. **Genera tu primera web**:

   - Ve a `/builder`
   - Escribe: _"Create a modern landing page for a coffee shop"_
   - Espera 5-10 segundos
   - ¡BOOM! GPT-4 genera el código

4. **Edita y descarga**:
   - Click en "Code" para ver/editar HTML
   - Click en "Download" para exportar

---

## 🐛 Solución Rápida de Problemas

### ❌ "MongoServerError: connection refused"

**Causa**: MongoDB no está corriendo

**Solución**:

```bash
# Verifica que MongoDB esté activo
mongosh

# Si no funciona, inícialo:
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
```

### ❌ "Invalid OpenAI API key"

**Causa**: API key incorrecta o no configurada

**Solución**:

1. Ve a: https://platform.openai.com/api-keys
2. Crea una nueva key
3. Copia y pega en `backend/.env`:
   ```
   OPENAI_API_KEY=sk-tu-key-aqui
   ```
4. Reinicia el backend

### ❌ "Network Error" al generar

**Causa**: Backend no está corriendo o CORS bloqueado

**Solución**:

```bash
# Verifica que backend esté en http://localhost:5000
cd backend
npm run dev

# Verifica que frontend use la URL correcta
# En frontend/.env debe decir:
VITE_API_URL=http://localhost:5000/api
```

### ❌ Frontend muestra página en blanco

**Causa**: Archivos no copiados correctamente

**Solución**:

```bash
cd frontend/src
ls  # Debe mostrar: App.jsx, main.jsx, pages/, components/, etc.

# Si faltan archivos, copia toda la estructura src/
```

---

## 💡 Tips para Empezar

### Mejores Prompts

✅ **Buenos**:

- "Modern landing page with gradient hero and pricing section"
- "Portfolio website with dark theme and project grid"
- "Dashboard with sidebar, stats cards, and charts"

❌ **Evitar**:

- "Make a website" (demasiado vago)
- "Something nice" (no específico)

### Ahorra Créditos

- Plan Free: 10 generaciones
- Usa templates como base y pídele mejoras
- Edita manualmente en vez de regenerar todo

### Deployment Rápido

```bash
# 1. Build frontend
cd frontend
npm run build

# 2. Deploy a Netlify
npm i -g netlify-cli
netlify deploy --prod --dir=dist

# 3. Deploy backend a Render.com
# - Crea cuenta en render.com
# - New Web Service
# - Conecta tu repo
# - Agrega variables de entorno
```

---

## 📚 Próximos Pasos

Una vez que todo funcione:

1. ✅ Lee el README.md completo
2. ✅ Explora todas las páginas (Templates, Pricing, Docs)
3. ✅ Prueba diferentes tipos de prompts
4. ✅ Guarda proyectos en el Dashboard
5. ✅ Personaliza el código generado

---

## 🆘 ¿Necesitas Ayuda?

- 📖 Lee README.md para documentación completa
- 🐛 Revisa la sección de Troubleshooting
- 💬 Abre un issue en GitHub
- 📧 Contacto: support@aibuilder.com

---

## ✅ Checklist Final

Antes de empezar a generar:

- [ ] Node.js instalado y funcionando
- [ ] MongoDB corriendo (local o Atlas)
- [ ] OpenAI API Key configurada en .env
- [ ] Backend corriendo en :5000
- [ ] Frontend corriendo en :5173
- [ ] Cuenta creada en la app
- [ ] Créditos disponibles

---

**¡Ya estás listo para crear sitios con IA! 🚀**

Happy Building!

---

## 🔗 Links Útiles

- OpenAI API Keys: https://platform.openai.com/api-keys
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Node.js: https://nodejs.org/
- Documentación GPT-4: https://platform.openai.com/docs

---

**Tiempo estimado de setup**: 10-15 minutos  
**Primer sitio generado**: 30 segundos después de setup

¡Disfruta construyendo con IA! ✨

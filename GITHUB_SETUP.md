# GitHub Integration Setup

Este documento explica cómo configurar la integración de GitHub en AI Builder.

## Características Agregadas

### Frontend (BuilderPage)

1. **Botón de Subir Archivos** 📎
   - Permite subir múltiples archivos (imágenes, PDF, documentos)
   - Muestra los archivos subidos con opción de eliminarlos
   - Ubicación: Barra de controles en el input

2. **Selector de Modelo de IA** ⚙️
   - Dropdown para elegir entre GPT-4, GPT-4-turbo, GPT-3.5-turbo
   - Indicador del modelo activo
   - Ubicación: Barra de controles en el input

3. **Grabación de Audio** 🎤
   - Botón para grabar audio desde el micrófono
   - Animación visual cuando está grabando
   - Conversión de audio a texto (placeholder - requiere implementar API de speech-to-text)
   - Ubicación: Barra de controles en el input

4. **Integración con GitHub** 🐙
   - Botón para abrir modal de GitHub
   - Se habilita solo cuando hay código generado
   - Ubicación: Barra de controles en el input

### Componente GithubModal

Modal completo para manejar la integración con GitHub:

- **Flujo de OAuth**: Conexión con GitHub usando OAuth
- **Creación de Repositorio**: Crea repos públicos o privados
- **Auto-sync**: Opción para sincronización automática
- **Push de código**: Sube HTML, CSS, y JS automáticamente
- **Gestión de conexión**: Conectar y desconectar GitHub

### Backend

#### Controlador: `github.controller.js`

Funciones implementadas:
- `initiateGithubAuth` - Inicia el flujo OAuth de GitHub
- `handleGithubCallback` - Maneja el callback de OAuth
- `createRepository` - Crea un nuevo repositorio con el código
- `updateRepository` - Actualiza un repositorio existente
- `disconnectGithub` - Desconecta la cuenta de GitHub

#### Rutas: `github.routes.js`

```
GET  /api/github/auth          - Iniciar OAuth
GET  /api/github/callback      - Callback de OAuth
POST /api/github/create-repo   - Crear repositorio
POST /api/github/update-repo   - Actualizar repositorio
POST /api/github/disconnect    - Desconectar GitHub
```

## Configuración de GitHub OAuth

### 1. Crear una GitHub OAuth App

1. Ve a GitHub Settings → Developer settings → OAuth Apps
2. Click en "New OAuth App"
3. Completa los siguientes campos:
   - **Application name**: AI Builder (o el nombre que prefieras)
   - **Homepage URL**: `http://localhost:5173` (desarrollo) o tu dominio en producción
   - **Authorization callback URL**: `http://localhost:5000/api/github/callback`
4. Click en "Register application"
5. Copia el **Client ID** y genera un **Client Secret**

### 2. Configurar Variables de Entorno

Agrega estas variables a tu archivo `.env` en el backend:

```env
# GitHub OAuth
GITHUB_CLIENT_ID=tu_client_id_aqui
GITHUB_CLIENT_SECRET=tu_client_secret_aqui
GITHUB_REDIRECT_URI=http://localhost:5000/api/github/callback
```

### 3. Flujo de Autenticación

1. Usuario hace click en "Connect GitHub" en el modal
2. Se abre una ventana popup con la página de autorización de GitHub
3. Usuario autoriza la aplicación
4. GitHub redirige al callback con un código
5. El backend intercambia el código por un access token
6. El token se guarda en localStorage del frontend

### 4. Crear Repositorio

Una vez conectado, el usuario puede:
1. Ingresar nombre del repositorio
2. Agregar descripción (opcional)
3. Elegir si es privado o público
4. Activar auto-sync
5. Click en "$ push"

El sistema automáticamente:
- Crea el repositorio en GitHub
- Sube un README.md
- Crea index.html con el código completo
- Opcionalmente crea archivos separados (styles.css, script.js)

## Funcionalidades Pendientes de Implementar

### 1. Speech-to-Text API

Actualmente es un placeholder. Para implementar completamente:

**Opción A: OpenAI Whisper API**
```javascript
const convertSpeechToText = async (audioBlob) => {
  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.webm');
  formData.append('model', 'whisper-1');

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: formData
  });

  const data = await response.json();
  setPrompt((prev) => prev + " " + data.text);
};
```

**Opción B: Web Speech API (gratis, pero menos precisa)**
```javascript
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  setPrompt((prev) => prev + " " + transcript);
};

recognition.start();
```

### 2. File Upload Processing

Actualmente solo almacena los archivos. Para procesarlos:

```javascript
const handleFileUpload = async (e) => {
  const files = Array.from(e.target.files);

  // Leer y procesar imágenes
  for (const file of files) {
    if (file.type.startsWith('image/')) {
      const base64 = await fileToBase64(file);
      // Enviar a GPT-4 Vision API o similar
    }
  }
};
```

### 3. Auto-Sync con GitHub

Para implementar auto-sync al guardar proyectos:

```javascript
// En BuilderStore
const saveProject = async (name, description) => {
  // ... guardar proyecto

  // Si auto-sync está activado
  const autoSync = localStorage.getItem('github_autosync');
  const repoFullName = localStorage.getItem('github_repo');

  if (autoSync && repoFullName) {
    await githubAPI.updateRepo({
      repoFullName,
      htmlCode: generatedCode.html,
      cssCode: generatedCode.css,
      jsCode: generatedCode.js,
      githubToken: localStorage.getItem('github_token'),
      commitMessage: `Update: ${name}`
    });
  }
};
```

### 4. GitHub Pages Deployment

Agregar opción para habilitar GitHub Pages automáticamente:

```javascript
// En github.controller.js después de crear el repo
await axios.post(
  `https://api.github.com/repos/${repo.owner.login}/${repo.name}/pages`,
  {
    source: {
      branch: 'main',
      path: '/'
    }
  },
  {
    headers: {
      Authorization: `Bearer ${githubToken}`,
      Accept: 'application/vnd.github.v3+json'
    }
  }
);
```

## Estructura de Archivos Modificados

```
frontend/
├── src/
│   ├── components/
│   │   └── GithubModal.jsx          ✨ NUEVO
│   ├── pages/
│   │   └── BuilderPage.jsx          📝 MODIFICADO
│   └── services/
│       └── api.js                   📝 MODIFICADO (agregado githubAPI)

backend/
├── src/
│   ├── controllers/
│   │   └── github.controller.js     ✨ NUEVO
│   ├── routes/
│   │   └── github.routes.js         ✨ NUEVO
│   └── server.js                    📝 MODIFICADO
```

## Testing

### Probar la Integración de GitHub

1. Inicia el servidor backend: `npm run dev`
2. Inicia el frontend: `npm run dev`
3. Genera un sitio web en el builder
4. Click en el botón de GitHub (icono de Octocat)
5. Click en "Connect GitHub"
6. Autoriza la aplicación
7. Completa el formulario y click en "$ push"
8. Verifica que el repositorio se creó en tu cuenta de GitHub

## Notas de Seguridad

⚠️ **IMPORTANTE**:
- Nunca expongas tu `GITHUB_CLIENT_SECRET` en el frontend
- Los tokens de GitHub deben ser almacenados de forma segura
- Considera usar cookies httpOnly en lugar de localStorage para tokens sensibles
- Implementa rate limiting en las rutas de GitHub
- Valida todos los inputs del usuario antes de crear repos

## Próximos Pasos Sugeridos

1. ✅ Implementar Speech-to-Text con OpenAI Whisper
2. ✅ Procesar archivos subidos (especialmente imágenes para GPT-4 Vision)
3. ✅ Auto-sync automático cuando se guarda un proyecto
4. ✅ Deployment automático a GitHub Pages
5. ✅ Gestión de múltiples repositorios (lista de repos del usuario)
6. ✅ Histórico de commits
7. ✅ Preview de cambios antes de push
8. ✅ Colaboración con otros usuarios

## Soporte

Si encuentras problemas:
1. Verifica que las variables de entorno estén configuradas
2. Revisa los logs del servidor para errores de autenticación
3. Asegúrate de que la URL de callback coincida exactamente con la configurada en GitHub
4. Verifica que el token de GitHub tenga los permisos necesarios (scope: repo, user)

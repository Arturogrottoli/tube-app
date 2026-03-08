# Guía de Despliegue - PocketTube Backend

Para que el backend funcione, el servidor debe tener instalado `yt-dlp` y `ffmpeg`. Usaremos **Docker** para asegurar que todo esté listo en la nube.

## 1. Instalación Local (Opcional)
- **Windows**: Descarga `yt-dlp.exe` y `ffmpeg` y agrégalos al PATH.

## 2. Despliegue en Render (GRATIS)
Render permite desplegar contenedores Docker de forma gratuita.

1. **Subir a GitHub**: Sube la carpeta `backend/` a un repositorio de GitHub (asegúrate de que el `Dockerfile` esté en la raíz de esa carpeta).
2. **Crear Web Service**:
   - Ve a [Dashboard de Render](https://dashboard.render.com/).
   - Click en **New** -> **Web Service**.
   - Conecta tu repositorio de GitHub.
   - **Root Directory**: `backend` (importante).
   - **Runtime**: `Docker`.
3. **Configuración**:
   - **Instance Type**: `Free`.
   - **Environment Variables**:
     - `PORT`: `3000`
4. **URL**: Una vez desplegado, Render te dará una URL (ej: `https://tube-backend.onrender.com`).

## 3. Configuración en la App
1. Ve a `src/services/api.js`.
2. Cambia `BASE_URL` por tu URL de Render.

> [!NOTE]
> En el plan gratuito de Render, el servidor se "apaga" tras 15 min de inactividad. La primera descarga después de un tiempo puede tardar un poco más en iniciar mientras el servidor arranca.

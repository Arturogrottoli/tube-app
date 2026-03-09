# Guía de Despliegue - PocketTube Backend

Para que el backend funcione, el servidor debe tener instalado `yt-dlp` y `ffmpeg`. Usaremos **Docker** para asegurar que todo esté listo en la nube.

## 1. Instalación Local (Opcional)
- **Windows**: Descarga `yt-dlp.exe` y `ffmpeg` y agrégalos al PATH.

## 2. Despliegue en Render (GRATIS)
Render permite desplegar contenedores Docker de forma gratuita y es ideal para este proyecto.

1.  **Subir a GitHub**: Sube la carpeta `backend/` a un nuevo repositorio de GitHub. Asegúrate de que el `Dockerfile` y `server.js` estén allí.
2.  **Crear Web Service**:
    - Ve a [Dashboard de Render](https://dashboard.render.com/).
    - Click en **New** -> **Web Service**.
    - Conecta tu repositorio de GitHub.
    - **Root Directory**: `backend` (esto es crucial).
    - **Runtime**: `Docker`.
3.  **Configuración**:
    - **Instance Type**: `Free`.
    - **Environment Variables**:
      - `PORT`: `3000` (Render lo detecta automáticamente, pero es bueno tenerlo).
4.  **Enlace Final**: Render te dará una URL (ej: `https://pockettube-backend.onrender.com`).

## 3. Configuración en la App
Una vez tengas tu URL de Render:
1.  Abre `src/services/api.js`.
2.  Cambia el valor de `BASE_URL` por tu nueva URL de Render.

> [!TIP]
> **Prueba Local**: Si quieres probar la app en tu celular físico con el backend corriendo en tu PC, usa la IP de tu red local (ej: `http://192.168.1.XX:3000`) en `BASE_URL`.

> [!NOTE]
> En el plan gratuito de Render, el servidor se "duerme" tras 15 min de inactividad. La primera descarga puede tardar unos segundos extra en iniciar mientras el contenedor se despierta.

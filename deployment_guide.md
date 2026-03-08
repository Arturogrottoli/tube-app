# Guía de Despliegue - PocketTube Backend

Para que el backend funcione, el servidor debe tener instalado `yt-dlp`. 

## 1. Instalación de `yt-dlp` (Local)
Si quieres probarlo en tu PC:
- **Windows**: Descarga el `.exe` de [yt-dlp](https://github.com/yt-dlp/yt-dlp) y agrégalo al PATH.
- **Mac/Linux**: `sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && sudo chmod a+rx /usr/local/bin/yt-dlp`

## 2. Despliegue en Railway
Railway usa **Nixpacks** por defecto, lo cual facilita la instalación de dependencias del sistema.

1. Sube tu carpeta `backend/` a un repo de GitHub.
2. En Railway, crea un "New Project" -> "Deploy from GitHub repo".
3. En la configuración del servicio, ve a **Variables** y agrega:
   - `PORT`: 3000 (o el que prefieras)
4. Para instalar `yt-dlp` automáticamente, crea un archivo llamado `nixpacks.toml` en la raíz de la carpeta `backend/`:

```toml
[phases.setup]
nixPkgs = ["...", "python3", "ffmpeg", "yt-dlp"]
```
*(Nota: Nixpacks suele incluir yt-dlp si lo pones en nixPkgs)*.

## 3. Configuración en la App
Una vez tengas la URL de Railway (ej: `https://pockettube-production.up.railway.app`):
1. Ve a `src/services/api.js`.
2. Cambia `YOUR_BACKEND_URL` por tu URL de Railway.

## 4. Dependencias del Frontend
Asegúrate de instalar estas librerías en tu proyecto Expo:
```bash
npx expo install expo-router expo-file-system expo-av react-native-safe-area-context react-native-screens
```

# Guía para Exportar Cookies de YouTube 🍪

Para que `yt-dlp` funcione en **Render** (o en cualquier servidor), necesita tus cookies de YouTube para demostrar que eres un usuario real y no un bot.

### Paso 1: Instalar una Extensión en tu Navegador
Necesitas una extensión para exportar tus cookies en formato Netscape (`cookies.txt`).
- [Get cookies.txt LOC](https://chrome.google.com/webstore/detail/get-cookiestxt-loc/ccdiecbhnmkhmhlpobpbebegecpclcke) (Recomendada para Chrome/Brave/Edge).

### Paso 2: Exportar las Cookies
1. Ve a [youtube.com](https://www.youtube.com) e inicia sesión si aún no lo has hecho.
2. Haz clic en el icono de la extensión "Get cookies.txt".
3. Haz clic en **Export** (o descarga el archivo para `youtube.com`).
4. El archivo se llamará `youtube.com_cookies.txt`. Cámbiale el nombre a simplemente **`cookies.txt`**.

### Paso 3: Poner el archivo en el Proyecto
1. Copia el archivo `cookies.txt` dentro de la carpeta `backend/` de tu proyecto.
2. Asegúrate de que el archivo esté en la misma carpeta que `server.js`.

### Paso 4: Subir los Cambios
1. Haz un `git add`, `git commit` y `git push` de tu repositorio de backend.
2. Render detectará el nuevo archivo `cookies.txt` y lo usará automáticamente en el próximo despliegue.

---

> [!IMPORTANT]
> **Seguridad**: Las cookies contienen tu sesión. No compartas este archivo públicamente. Si tu repositorio de GitHub es público, agrégalo al `.gitignore` y súbelo a Render usando sus **Secret Files**.

# Usar una imagen base de Python (necesaria para yt-dlp) con Node.js
FROM nikolaik/python-nodejs:python3.11-nodejs20-slim

# Instalar FFmpeg (necesario para procesar audio/video)
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

# Crear directorio de la app
WORKDIR /app

# Instalar yt-dlp directamente vía pip para tener la última versión
RUN pip install --no-cache-dir yt-dlp

# Copiar archivos de dependencias de Node.js
COPY package*.json ./

# Instalar dependencias de Node.js
RUN npm install

# Copiar el resto del código del backend
COPY . .

# Exponer el puerto que Render usará (por defecto 3000 o el que especifique la variable PORT)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "server.js"]

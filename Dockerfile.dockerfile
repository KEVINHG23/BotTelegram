# Usamos Node 18
FROM node:18

# Evitamos que Puppeteer descargue Chromium (ya lo instalamos manual)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Instalamos Chromium y librerías necesarias
RUN apt-get update && apt-get install -y \
    chromium \
    chromium-browser \
    libglib2.0-0 \
    libnss3 \
    libgconf-2-4 \
    libfontconfig1 \
    libxss1 \
    libasound2 \
    libxtst6 \
    libxrandr2 \
    libgbm-dev \
    libatk1.0-0 \
    libc6 \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    xdg-utils \
    --no-install-recommends

# Carpeta de trabajo
WORKDIR /app

# Copiamos package.json y package-lock.json
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos todo el proyecto
COPY . .

# Comando para arrancar el bot
CMD ["node", "bot.js"]
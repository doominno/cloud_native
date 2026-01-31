# Usa Node.js LTS
FROM node:20-alpine

# Crea directorio de trabajo
WORKDIR /app

# Copia package.json y package-lock.json
COPY package*.json ./

# Instala dependencias
RUN npm install --production

# Copia todo el código
COPY . .

# Expone el puerto que usa el backend
EXPOSE 5000

# Comando por defecto
CMD ["node", "server.js"]

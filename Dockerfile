# Usa una imagen base oficial de Node.js
FROM node:20-alpine

# Crear y establecer el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar los archivos package.json y package-lock.json (si lo tienes)
COPY package*.json ./

# Instalar las dependencias de la aplicación
RUN npm install

# Copiar el resto del código fuente al contenedor
COPY . .

# Exponer el puerto en el que la aplicación escuchará
EXPOSE 5000

# Comando para ejecutar la aplicación
CMD ["npm", "start"]

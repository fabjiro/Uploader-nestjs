# Etapa 1: Construcción
FROM node:20-alpine AS builder

# Configuración del entorno de trabajo
WORKDIR /app

# Copia los archivos necesarios para instalar las dependencias
COPY package.json pnpm-lock.yaml ./
# Copia el archivo .env
COPY .env .env

# Instala pnpm globalmente y luego las dependencias del proyecto
RUN npm install -g pnpm && pnpm install

# Copia el resto del código fuente
COPY . .

# Compila el proyecto
RUN pnpm build

# Etapa 2: Imagen final para producción
FROM node:20-alpine AS runner

# Configuración del entorno de trabajo
WORKDIR /app

# Copia los archivos necesarios desde la etapa de construcción
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/.env ./.env

# Instala únicamente las dependencias de producción
RUN npm install -g pnpm && pnpm install --prod

# Expone el puerto de la aplicación
EXPOSE 3000

# Configura las variables de entorno
ENV NODE_ENV=production

# Comando para ejecutar la aplicación
CMD ["node", "dist/main.js"]

# Etapa de construcción
FROM node:20-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa de producción
FROM nginx:stable-alpine as production-stage
# Copiamos el build a la ruta estándar de nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html
# Copiamos el config simplificado
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
# Etapa 1: Build de Angular
FROM node:20 AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build -- --configuration production

# Etapa 2: Imagen final con Nginx
FROM nginx:alpine
COPY --from=build /app/dist/tangerine-player-front/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

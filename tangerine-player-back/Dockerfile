FROM node:18

WORKDIR /app

# Instala netcat para el script de espera
RUN apt-get update && apt-get install -y netcat-openbsd


COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g forever

RUN apt-get -y update && apt -y install nano

COPY . .

EXPOSE 3000

CMD ["forever", "-o", "app.log", "-e", "app-error.log", "server/index.js"]
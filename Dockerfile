FROM node:18

ENV NODE_ENV=production

WORKDIR /app

RUN apt-get update -y && apt-get install -y nano

RUN npm config set registry https://registry.npmjs.org/

RUN npm install -g forever

COPY package*.json ./

RUN npm install --verbose || { echo 'npm install failed'; exit 1; }

COPY . .

EXPOSE 3000

CMD ["forever", "-o", "app.log", "-e", "app-error.log", "server/index.js"]

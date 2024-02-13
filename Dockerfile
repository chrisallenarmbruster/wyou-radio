FROM node:18

ENV NODE_ENV=production

WORKDIR /app

# Install a text editor inside the container for debugging and maintenance purposes
RUN apt-get update -y && apt-get install -y nano

RUN npm config set registry https://registry.npmjs.org/

# Ensure npm version is same as the one used in development
RUN npm install -g npm@9.5.1

# Install forever to keep the application running (failsafe for production environments)
RUN npm install -g forever

COPY package*.json ./

# Clean install of dependencies from package-lock.json, no audits
RUN npm ci --no-audit --verbose || { echo 'npm install failed'; exit 1; }

COPY . .

EXPOSE 3000

CMD ["forever", "-o", "app.log", "-e", "app-error.log", "server/index.js"]

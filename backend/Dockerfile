FROM node:22.16.0
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npx", "ts-node-dev", "src/index.ts"]



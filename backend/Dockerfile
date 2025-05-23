FROM node:22.16.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

#RUN npx prisma migrate deploy

CMD ["npx", "ts-node-dev", "src/index.ts"]

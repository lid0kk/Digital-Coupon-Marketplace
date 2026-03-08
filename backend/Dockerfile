FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build typescript
RUN npx tsc

EXPOSE 3000

# Push DB schema and start server
CMD npx prisma generate && npx prisma db push && node dist/index.js

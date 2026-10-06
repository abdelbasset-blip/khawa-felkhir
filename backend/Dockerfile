# Dockerfile pour le backend Khawa Felkhir
FROM node:20-alpine AS builder

WORKDIR /app

# Dépendances système pour Prisma
RUN apk add --no-cache openssl libc6-compat

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npx prisma generate
RUN npm run build

# Étape finale de production
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl libc6-compat

ENV NODE_ENV=production
ENV PORT=5000

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 5000

CMD ["node", "dist/server.js"]

FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS app

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=development
ENV DATABASE_URL="postgresql://nova_previne:nova_previne_dev@db:5432/nova_previne?schema=public"

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run prisma:generate

EXPOSE 3000

CMD ["npm", "run", "dev"]

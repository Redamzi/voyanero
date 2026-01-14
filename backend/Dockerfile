FROM node:20-alpine AS base

FROM base AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
# Generate Prisma Client
RUN npx prisma generate

FROM base AS runner
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Create directory for sqlite db
RUN mkdir -p /app/data && chown -R node:node /app/data

EXPOSE 8000
CMD ["npm", "start"]

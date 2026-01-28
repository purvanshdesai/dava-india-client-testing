# -----------------------
# Build stage
# -----------------------
FROM node:22.7.0-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# -----------------------
# Runtime stage
# -----------------------
FROM node:22.7.0-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Copy ONLY the standalone server output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]

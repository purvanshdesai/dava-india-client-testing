# ----------------------------
# Stage 1: Build
# ----------------------------
FROM node:22.7.0 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN yarn 

# Copy the rest of the app
COPY . .

# Build the Next.js app
RUN yarn build

# ----------------------------
# Stage 2: Production
# ----------------------------
FROM node:22.7.0-slim

# Set working directory
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Expose the port Next.js runs on
EXPOSE 3000

# Start the Next.js server
CMD ["npm", "start"]


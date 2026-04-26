# Base image
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (for better caching)
COPY package*.json ./
RUN npm install

# Copy source and prisma schema
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the app
RUN npm run build

# ---
# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy built assets and prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Environment variables
ENV NODE_ENV=production

# Expose the API port
EXPOSE 3001

# Start the application
CMD ["npm", "run", "start:prod"]

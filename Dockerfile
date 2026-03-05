# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package*.json ./

# Copy backend and frontend directories
COPY backend ./backend
COPY frontend ./frontend

# Install dependencies
RUN npm install

# Build frontend
WORKDIR /app/frontend
RUN npm run build

# Runtime stage
FROM node:18-alpine

WORKDIR /app

# Install only production dependencies for backend
RUN npm install -g pm2

COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install --production

# Copy built frontend
COPY --from=builder /app/frontend/dist /app/backend/dist

# Copy backend source
COPY backend/src ./src
COPY backend/tsconfig.json ./

# Build TypeScript
RUN npm run build

WORKDIR /app/backend

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

EXPOSE 4000

CMD ["node", "dist/index.js"]

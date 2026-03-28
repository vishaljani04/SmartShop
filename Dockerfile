# Build stage - Client
FROM node:18-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app

# Install server dependencies
COPY server/package*.json ./server/
RUN cd server && npm ci --production

# Copy server code
COPY server/ ./server/

# Copy built client
COPY --from=client-build /app/client/dist ./client/dist

# Add static file serving to server
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

WORKDIR /app/server
CMD ["node", "server.js"]

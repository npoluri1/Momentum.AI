FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm install
COPY src/ ./src/
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./
EXPOSE 3100
ENV MCP_TRANSPORT=http
CMD ["node", "dist/index.js"]

FROM node:20-alpine AS development
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm install
COPY . .
EXPOSE 3100
CMD ["npm", "run", "dev"]

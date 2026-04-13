FROM node:20-slim

WORKDIR /app

# Copy the server configuration
COPY server/package*.json ./server/
COPY server/tsconfig.json ./server/

# Copy the shared logic or mount it
# In production we'd copy everything, in dev we mount
COPY src ./src
COPY data ./data

WORKDIR /app/server
RUN npm install
RUN npm run build

EXPOSE 8000

ENV PORT=8000

CMD ["npm", "start"]

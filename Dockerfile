# Use Node.js LTS version
FROM node:20-alpine
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose port for Vite dev server
EXPOSE 5173

# Start the app in development mode
CMD ["npm", "run", "dev"]

# Use official Node.js long-term support alpine image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including devDependencies for nodemon if needed, or production only)
RUN npm install

# Copy application files
COPY . .

# Expose port
EXPOSE 7000

# Set environment variable defaults
ENV PORT=7000
ENV NODE_ENV=production

# Start application
CMD ["npm", "start"]

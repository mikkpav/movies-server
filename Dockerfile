# Use Node 20
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Install ts-node globally for dev
RUN npm install -g ts-node ts-node-dev

# Copy the rest of the code
COPY . .

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "run", "dev"]

COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh
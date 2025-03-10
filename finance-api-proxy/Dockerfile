# Use lightweight Node.js image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package.json package-lock.json ./

# Install dependencies (including devDependencies)
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port used by the proxy
EXPOSE 4000

# Start the API proxy using nodemon
CMD ["npx", "nodemon", "index.js"]

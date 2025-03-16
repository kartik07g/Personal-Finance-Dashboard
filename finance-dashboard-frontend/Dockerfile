# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Receive build-time args from docker-compose.yaml
ARG FINANCE_API_PROXY_URL_BASE

# Make them available as ENV during build
ENV FINANCE_API_PROXY_URL_BASE=$FINANCE_API_PROXY_URL_BASE

# Copy the rest of the app
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]

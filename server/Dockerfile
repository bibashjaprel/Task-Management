# Use Node.js official image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY ./server/package.json ./server/package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY ./server ./ 

# Expose the port your backend server will run on
EXPOSE 5001

# Start the server
CMD ["node", "server.js"]

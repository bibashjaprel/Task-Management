# Use Node.js official image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY ./client/package.json ./client/package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY ./client ./

# Build the React app for production
RUN npm run build

# Install a static file server globally (serve package)
RUN npm install -g serve

# Set the command to serve the build folder
CMD ["serve", "-s", "build", "-l", "3000"]

# Expose the port the app will run on
EXPOSE 3000

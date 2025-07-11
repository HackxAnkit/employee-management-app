# Use an official Node.js runtime as a parent image
# We use the 'alpine' variant for a smaller image size
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
# Using 'COPY . .' would invalidate the cache on every file change.
# This approach ensures 'npm install' is only run when dependencies change.
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application source code to the working directory
# This includes server.js and the 'public' directory
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Define the command to run the application
CMD [ "node", "server.js" ]


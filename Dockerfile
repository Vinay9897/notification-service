
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app


# These files contain information about your project's dependencies
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port your application will run on
# If your app runs on port 3000, for example:
EXPOSE 3000

# Start the application
# Assuming your start script is defined in package.json
CMD ["npm", "start"]

# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install nodemon globally for development use
RUN npm install -g nodemon

COPY . .

# Expose the port your server uses
EXPOSE 3030

ENTRYPOINT ["nodemon",  "--legacy-watch", "/usr/src/app/server.js"]  
CMD ["npm", "run", "dev"]

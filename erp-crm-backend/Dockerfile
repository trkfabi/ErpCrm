# Use the Node.js image
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the Prisma schema and migrations
COPY ./prisma ./prisma

# Copy the application source code
COPY . .

# Generate the Prisma client
RUN npx prisma generate

# Expose the application port
EXPOSE 3000

# Set the default command
CMD ["npm", "run", "dev"]
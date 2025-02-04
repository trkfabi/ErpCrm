# Base Stage
FROM node:18-alpine AS base
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

# Development Stage
FROM base AS development
RUN npm install --only=dev
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Staging Stage
FROM base AS staging
RUN npm install --only=dev
EXPOSE 3000
CMD ["npm", "run", "start:staging"]

# Production Stage
FROM base AS production
RUN npm install --only=prod
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
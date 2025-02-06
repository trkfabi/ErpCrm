FROM node:18-alpine
# Instalar curl
RUN apk --no-cache add curl postgresql-client

# Define build argument for NODE_ENV (default to 'development' if not passed)
ARG NODE_ENV=development

# Log the value of NODE_ENV during the build
RUN echo "Building with NODE_ENV=${NODE_ENV}"

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY ./prisma ./prisma
COPY . .
RUN npx prisma generate

EXPOSE 3000

# Ejecutar el script correcto según NODE_ENV
CMD ["sh", "-c", "echo 'NODE_ENV is: $NODE_ENV' && npm run start:$NODE_ENV"]
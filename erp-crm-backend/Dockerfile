FROM node:18-alpine
# Instalar curl
RUN apk --no-cache add curl

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY ./prisma ./prisma
COPY . .
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "run", "start"]

FROM node:22-alpine

# Create Container 
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

# Build the NestJS application
RUN npm run build

# Expose the port & start the application
EXPOSE 3001
CMD ["npm", "run", "start:prod"]

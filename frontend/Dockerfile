# Use Node.js for building the frontend
FROM node:16 AS build

# Set a working directory
WORKDIR /app

# Copy package.json and package-lock.json first for caching
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Copy source files and build the app
COPY . .
RUN npm run build

# Use Nginx to serve the frontend
FROM nginx:alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build output to Nginx's HTML directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 for Nginx
EXPOSE 80

# Run Nginx server
CMD ["nginx", "-g", "daemon off;"]
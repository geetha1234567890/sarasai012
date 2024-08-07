# Stage 1: Build the React application
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Install git
#RUN apt-get update && apt-get install -y git

# Copy the frontend source code to the container
COPY ./SARAS_AI_FRONTEND /app/SARAS_AI_FRONTEND

# Change directory to the frontend
WORKDIR /app/SARAS_AI_FRONTEND

# Install dependencies
RUN npm install

# Build the React app
RUN npm run build

# Stage 2: Serve the React application with NGINX
FROM nginx:alpine

# Remove the default NGINX static resources
RUN rm -rf /usr/share/nginx/html/*

# Copy the build files from the previous stage
COPY --from=build /app/SARAS_AI_FRONTEND/build /usr/share/nginx/html

# Expose port 3000
EXPOSE 3000

# Update NGINX configuration to listen on port 3000
RUN sed -i 's/listen       80;/listen       3000;/g' /etc/nginx/conf.d/default.conf

# Start NGINX server
CMD ["nginx", "-g", "daemon off;"]


# Use lightweight alpine-based Nginx official image
FROM nginx:alpine

# Copy custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy all application static assets into the Nginx public directory
COPY index.html style.css script.js quotes.js /usr/share/nginx/html/

# Expose HTTP standard port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]

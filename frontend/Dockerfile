# Use a lightweight Nginx image
FROM nginx:alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Copy your static site files into Nginx's default directory
COPY index.html .
# If you have other assets (CSS, JS, images), copy them too:
# COPY ./assets ./assets

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

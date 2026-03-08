FROM node:20 as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# Setting env var for build if needed, though vite handles it at runtime if window.env is used, 
# but VITE_API_URL is baked in at build time. For docker-compose, this is fine.
ARG VITE_API_URL=http://localhost:3000/api/v1
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

FROM nginx:alpine
# Copy custom nginx config for SPA routing
RUN echo 'server { listen 5173; location / { root /usr/share/nginx/html; index index.html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]

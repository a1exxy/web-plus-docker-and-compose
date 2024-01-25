FROM node:16-alpine AS builder
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
WORKDIR /app
COPY package*.json ./
RUN npm i  --no-audit --no-fund
RUN env > show_env
COPY . .
RUN npm run build

FROM openresty/openresty:1.25.3.1-0-alpine AS production
#FROM nginx:1.23.1-alpine AS production
WORKDIR /app
COPY --from=builder /app/show_env ./
COPY --from=builder /app/build /usr/local/openresty/nginx/html
#COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80/tcp
CMD [ "/usr/local/openresty/bin/openresty", "-g", "daemon off;" ]
#CMD [ 'nginx', '-g', 'daemon off;']

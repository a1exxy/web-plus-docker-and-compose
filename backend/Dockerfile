FROM node:16-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

FROM node:16-alpine AS production
WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund \
    && npm i -g pm2
COPY --from=builder /app/dist ./dist/
COPY ./ecosystem.config.js ./
EXPOSE 3000
ENTRYPOINT ["pm2-runtime", "start", "ecosystem.config.js"]
#CMD [ "node", "./dist/main.js" ]
#ENTRYPOINT /bin/sh

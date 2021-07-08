FROM node:current-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src src
RUN npm run build

FROM node:current-alpine
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
RUN apk add --no-cache tini
WORKDIR /usr/src/app
COPY package*.json ./
RUN chown -R node:node .
USER node
RUN npm install --only=production
COPY --from=builder /usr/src/app/dist/ dist/

#tini allows node to properly handle SIGINT, SIGTERM etc.
ENTRYPOINT [ "/sbin/tini","--", "node", "dist/main.js" ]

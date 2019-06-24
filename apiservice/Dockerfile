FROM node:10.9.0-alpine
WORKDIR /usr/local/app
ADD package-lock.json .
ADD package.json .
ADD lib ./lib
RUN npm ci --only=production
ENV LISTEN_PORT=3100
ENV NODE_ENV=development
EXPOSE $LISTEN_PORT

CMD [ "npm", "start" ]

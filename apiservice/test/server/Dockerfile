FROM node:10.9.0-alpine
WORKDIR /usr/local/app
ADD package-lock.json .
ADD package.json .
ADD www ./www
ADD index.js .
RUN npm ci --only=production
ENV PORT=9100
ENV NODE_ENV=development
EXPOSE $PORT

CMD [ "npm", "start" ]

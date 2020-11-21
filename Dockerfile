FROM node:12.18.1

ENV NODE_ENV=production

WORKDIR /app

COPY "package.json" .
COPY "package-lock.json" .
COPY "dist/src/" .

RUN npm install --production

CMD [ "node", "index" ]

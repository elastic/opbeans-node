FROM node:8 as build

WORKDIR /app
ADD . /app
ENV NODE_ENV=production
ENV ELASTIC_APM_JS_BASE_SERVICE_NAME=opbeans-react
RUN npm install

RUN npm install pm2

FROM node:8-slim AS runtime
WORKDIR /app
COPY --from=build /app ./
COPY --from=opbeans/opbeans-frontend:latest /app/ /app/client/
RUN npm install

CMD ["./node_modules/.bin/pm2-runtime", "ecosystem.config.js"]

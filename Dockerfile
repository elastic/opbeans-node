FROM node:12-alpine

WORKDIR /app
ADD . /app
ENV NODE_ENV=production
ENV ELASTIC_APM_JS_BASE_SERVICE_NAME=opbeans-react
RUN npm install

RUN npm install pm2 -g

COPY --from=opbeans/opbeans-frontend:latest /app/build /app/client/build
COPY --from=opbeans/opbeans-frontend:latest /app/package.json /app/client/package.json

CMD ["pm2-runtime", "ecosystem.config.js"]

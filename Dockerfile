FROM node:8

WORKDIR /app
ADD . /app
ENV NODE_ENV=production
ENV ELASTIC_APM_JS_BASE_SERVICE_NAME=opbeans-react
RUN npm install

RUN npm install pm2 -g

COPY --from=opbeans/opbeans-frontend:latest /app/ /app/client/

CMD ["pm2-runtime", "processes.config.js"]

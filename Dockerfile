FROM node:8

WORKDIR /app
ADD . /app
ENV NODE_ENV=production
ENV ELASTIC_APM_JS_BASE_SERVICE_NAME=opbeans-react
RUN npm install

COPY --from=opbeans/opbeans-frontend:latest /app/ /app/client/

CMD ["npm", "start"]

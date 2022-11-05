FROM node:18-alpine

WORKDIR /app
ADD . /app
ENV NODE_ENV=production
ENV ELASTIC_APM_JS_BASE_SERVICE_NAME=opbeans-react
RUN npm install

RUN npm install pm2 -g

COPY --from=opbeans/opbeans-frontend:latest /app/build /app/client/build
COPY --from=opbeans/opbeans-frontend:latest /app/package.json /app/client/package.json

LABEL \
    org.label-schema.schema-version="1.0" \
    org.label-schema.vendor="Elastic" \
    org.label-schema.name="opbeans-node" \
    org.label-schema.version="3.40.0" \
    org.label-schema.url="https://hub.docker.com/r/opbeans/opbeans-node" \
    org.label-schema.vcs-url="https://github.com/elastic/opbeans-node" \
    org.label-schema.license="MIT"

CMD ["pm2-runtime", "ecosystem.config.js"]

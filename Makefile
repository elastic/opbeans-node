ROOT_DIR:=$(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))

update-frontend:
	-test ! -d client && git clone https://github.com/elastic/opbeans-frontend client
	cd client && git pull

compile-frontend:
	cd client && npm install && npm run-script build

frontend: | update-frontend compile-frontend

push-image:
	-docker info | grep "Registry: https://index.docker.io/v1/" || docker login
	docker build . -t opbeans/opbeans-nodejs
	docker push opbeans/opbeans-nodejs

.PHONY: frontend update-frontend compile-frontend push-image

#!/bin/sh

IMAGE=superafroman/jobz

TAG=${IMAGE}:$1
DOCKER_USER=$2
DOCKER_EMAIL=$3
DOCKER_PASSWORD=$4

docker login -u ${DOCKER_USER} -e ${DOCKER_EMAIL} -p ${DOCKER_PASSWORD}

docker pull ${TAG} || docker pull ${IMAGE}:latest || true
docker build -t ${TAG} .
docker tag -f ${TAG} ${IMAGE}:latest
docker push ${TAG}
docker push ${IMAGE}:latest


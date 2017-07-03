#!/bin/sh

IMAGE=superafroman/jobz

TAG=${IMAGE}:$1
HOST=$2

ssh -o StrictHostKeychecking=no core@${HOST} "docker pull ${TAG}"
ssh -o StrictHostKeychecking=no core@${HOST} "fleetctl stop router"
ssh -o StrictHostKeychecking=no core@${HOST} "docker tag -f ${TAG} ${IMAGE}:latest"
ssh -o StrictHostKeychecking=no core@${HOST} "docker rmi ${TAG}"
ssh -o StrictHostKeychecking=no core@${HOST} "docker rmi \$(docker images --filter dangling=true -q)" 2>/dev/null
ssh -o StrictHostKeychecking=no core@${HOST} "fleetctl start router"

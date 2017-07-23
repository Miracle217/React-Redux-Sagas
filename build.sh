#!/bin/bash

env='local'
key="$1"

GULP_PATH=node_modules/.bin/gulp
BUILD_ENV=${NODE_ENV:-$env}

dev () {
    echo "Executing: NODE_ENV=$BUILD_ENV $GULP_PATH"
    NODE_ENV=$BUILD_ENV $GULP_PATH
}

test () {
    echo "Executing: $GULP_PATH test"
    $GULP_PATH test
}

config () {
    echo "Executing: NODE_ENV=$BUILD_ENV $GULP_PATH copy-config"
    NODE_ENV=$BUILD_ENV $GULP_PATH copy-config
}

build () {
    echo "Executing: NODE_ENV=$BUILD_ENV $GULP_PATH compile"
    NODE_ENV=$BUILD_ENV $GULP_PATH compile
}

deploy () {
    echo "Executing: NODE_ENV=$BUILD_ENV $GULP_PATH deploy"
    NODE_ENV=$BUILD_ENV $GULP_PATH deploy
}

clean () {
    echo "Executing: $GULP_PATH clean"
    $GULP_PATH clean
}

help () {
    echo "
Simple build and deploy script

./build.sh {dev|test|build|config|deploy|docker|shipit|help}

Options:

dev:
  Builds and launches a local dev server

test:
  Runs unit tests

config:
  Copy Environment based config to app/config.js

clean:
  Removes previously built distrobution

build:
  Builds the dist/ directory data for deploy

deploy:
  Deploys the dist/ data to S3

docker:
  Run npm start

shipit:
  Performs a 'mark', 'build' & 'deploy' in one fell swoop

help:
  Displays this help message.
"
}

case $key in
    dev)
        config
        dev
        ;;
    test)
        config
        test
        ;;
    clean)
        clean
        ;;
    config)
        config
        ;;
    build)
        config
        build
        ;;
    deploy)
        deploy
        ;;
    shipit)
        clean
        config
        build
        deploy
        ;;
    docker)
        npm start
        ;;
    help)
        help
        ;;
    *)
        echo "UNKNOWN ACTION: $key"
        echo
        help
        ;;
esac

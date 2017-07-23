FROM node:5.4.0
MAINTAINER Synctree Appforce

# Create base app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# build node dependancies
COPY package.json /usr/src/app/
RUN npm install

# Copy application code to image
COPY . /usr/src/app

RUN rm -rf dist/development
RUN rm -rf dist/staging
RUN rm -rf dist/production

RUN NODE_ENV=development ./build.sh build
RUN NODE_ENV=staging     ./build.sh build
RUN NODE_ENV=production  ./build.sh build

# Expose default Web port
EXPOSE 3001

# Start the web server
CMD [ "npm", "start" ]

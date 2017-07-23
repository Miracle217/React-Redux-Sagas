# Boost-Web

## Setup

### Dependancies

- `node` & `npm`
- Install `gulp`
    - `npm install -g gulp`

### Install

* Clone the repo
* Run `npm install`

## Helper Script

There is a helper script in the root directort called `./build.sh`. This will assit is streamlining the dev and deploy process.

**NOTE:** It is SUPER simple. We can extend it as needed.

```
Simple build and deploy script

./build.sh {dev|test|build|deploy|shipit|help}

Options:

dev:
  Builds and launches a local dev server

test:
  Runs unit tests

build;
  Builds the dist/ directory data for deploy

deploy:
  Deploys the dist/ data to S3

shipit:
  Performs and 'build' & 'deploy' in one fell swoop

help:
  Displays this help message.
```

### Development
* Run `./build.sh dev`
* Go to `localhost:8889` to display the app
* Go to `localhost:8889/testrunner.html` to see your tests
* Any changes to `app` or `styles` folder will automatically rebuild to `build` folder
* Both tests and application changes will refresh automatically in the browser
* Run `./build.sh test` to run all tests with phantomJS and produce XML reports

### Minify the code, ready for production
* Run `./build.sh build` to create deployment ready code
* Run `./build.sh deploy` to sync the compiled code to S3
* You can also just use `./build.sh shipit` to perform an build & deploy
* To deploy to S3 you will need valid AWS credentials. When you have those, put them is a file call `.aws.json` with the following format:

```
{
  "key": "ACCESS_KEY",
  "secret": "SECRET_KEY",
  "bucket": "boost-web.synctree.com",
  "region": "us-standard"
}
```

### Directory
* **build/**: Where your automatically builds to. This is where you launch your app in development
* **dist/**: Where the deployed code exists, ready for production
* **styles/**: Where you put your css files
* **specs/**: Where you put your test files
* **gulpfile**: Gulp configuration

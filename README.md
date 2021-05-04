![Node Boost](https://drive.google.com/uc?export=download&id=1a1-AqMsc_l2sqo281WSWaAy5bvcfNWt-)


[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/allisonmachado/node-boost.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/allisonmachado/node-boost/context:javascript) [![Total alerts](https://img.shields.io/lgtm/alerts/g/allisonmachado/node-boost.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/allisonmachado/node-boost/alerts/) ![GitHub tag (latest by date)](https://img.shields.io/github/v/tag/allisonmachado/node-boost) ![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/allisonmachado/node-boost/Node.js%20CI/master) [![Coverage Status](https://coveralls.io/repos/github/allisonmachado/node-boost/badge.svg?branch=master)](https://coveralls.io/github/allisonmachado/node-boost?branch=master) ![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/allisonmachado/node-boost) ![GitHub](https://img.shields.io/github/license/allisonmachado/node-boost)

[Opinionated and coherent](http://allison.bsb.br/node-boost/) blueprint for web [Node.js](http://nodejs.org) apps.

## Features

  * Comprehensive and decoupled layered architecture
  * Test setup and coverage provided
  * Structured and well defined logging
  * Cross cutting concerns organized in middlewares and decorators
  * Auxiliar scripts to power the development cycle
  * Docker files & compose examples
  * GCP AppEngine file example

## Get started in 5 easy steps

1. To create a new project based on this blueprint:

```bash
$ git clone https://github.com/allisonmachado/node-boost.git --depth 1
$ cd node-boost/
$ git remote set-url origin new.git.url/here
```

2. Then use .env.example as a starting point for the environment variables:

```bash
$ cp .env.example .env
```

3. Install the web project dependencies and compile the source code:

```bash
$ npm install
$ npm run build
```

4. Use Docker Compose to set up the development environment:

```bash
npm run compose:up
```

5. In addition to that, it is required to set up the database schema. When a mysql container is started for the first time, a new schema with the name specified in the MYSQL_DATABASE env variable will be created. To create the tables make sure you have the correct env variables and run:

```bash
npm run migrate:latest
```

After the steps above, you should be able to interact with the app via the rest interface:

```bash
curl --location --request GET 'http://localhost:8080/users'
```

## License

  [MIT](LICENSE)
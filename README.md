![Node Boost](https://drive.google.com/uc?export=download&id=1a1-AqMsc_l2sqo281WSWaAy5bvcfNWt-)


[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/allisonmachado/node-boost.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/allisonmachado/node-boost/context:javascript) [![Total alerts](https://img.shields.io/lgtm/alerts/g/allisonmachado/node-boost.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/allisonmachado/node-boost/alerts/) ![GitHub tag (latest by date)](https://img.shields.io/github/v/tag/allisonmachado/node-boost) ![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/allisonmachado/node-boost/Node.js%20CI/master) [![Coverage Status](https://coveralls.io/repos/github/allisonmachado/node-boost/badge.svg?branch=master)](https://coveralls.io/github/allisonmachado/node-boost?branch=master) ![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/allisonmachado/node-boost) ![GitHub](https://img.shields.io/github/license/allisonmachado/node-boost)

Opinionated and coherent blueprint for web [Node.js](http://nodejs.org) apps.

## Features

  * Comprehensive and decoupled layered architecture
  * Test setup and coverage provided
  * Structured and well defined logging
  * Cross cutting concerns organized in middlewares and decorators
  * Auxiliar scripts to power the development cycle
  * Docker files & compose examples
  * GCP AppEngine file example

## Overview

To be able to accomodate a source code base that may grow big as time passes, I've created this simple template that put into action a layered architecture with well-defined responsibilities decoupled by interface definitions:

1. *./src/middleware* - first chain of request processing.
2. *./src/controllers* - delegates the request to the appropriate underlying system.
3. *./src/services* - custom business related processing and rules (optional).
4. *./src/data* - data sources interaction, such as relational databases (mysql given as an example).
5. *./src/lib* - shared and reusable code.

## Philosophy

To enable a clean implementation and to simplify the writing of tests, this template, leveraged by the power Typescript language, applies the concept of Inversion of Control.

Although no auxiliary library for IoC is being used (such as [inversify](https://github.com/inversify/InversifyJS)), the responsibility of a DI container for now is written in the [index.js](https://github.com/allisonmachado/node-boost/blob/master/src/index.ts) file which is the startup point of the application. 

The implementation of loosely coupled elements can be optionally achieved through the specification of well defined interfaces.

## Examples

This template also provides a small and simple set of features to serve as implementation examples:

1. Simple CRUD of users
2. Simple Jwt token based Auth

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
npm run compose:start
```

5. In addition to that, it is required to set up the database schema. When a mysql container is started for the first time, a new schema with the name specified in the MYSQL_DATABASE env variable will be created. To create the tables make sure you have the correct env variables and run:

```bash
npm run migrate
```

After the steps above, you should be able to interact with the app via the rest interface:

```bash
curl --location --request GET 'http://localhost:8080/users'
```

## Development

Throughout development time you may modify the source code, then use the following script to see the changes reflected in the app:

```bash
npm run compose:restart
```

## Tests

To run the test suite:

```bash
$ npm test
```

To check the coverage:

```bash
$ npm run test:coverage
```

## License

  [MIT](LICENSE)
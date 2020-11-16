# Node Boost

Opinionated and pragmatic blueprint for web [Node.js](http://nodejs.org) apps.

## Quick Start

This is not available through the [npm registry](https://www.npmjs.com/).

To create a new project based on this blueprint use this repository as a basis:

```bash
$ git clone https://github.com/allisonmachado/node-boost.git --depth 1
$ cd node-boost/
$ git remote set-url origin new.git.url/here
$ cp .env.example .env
$ npm install
$ npm start
```

## Features

  * Comprehensive and decoupled layered architecture
  * Test setup and coverage provided
  * Structured and well defined logging
  * Cross cutting concerns organized in middlewares and decorators
  * Auxiliar scripts provided to bootstrap development cycle

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

This template also provides a small and simple set of features to serve as an example:

1. Simple CRUD of users
2. Simple Jwt token based Auth

## Dependency Highlights

  * [ExpressJS](https://github.com/expressjs/express)
  * [MySql](https://github.com/mysqljs/mysql)
  * [Winston](https://github.com/winstonjs/winston)
  * [Typescript](https://github.com/microsoft/TypeScript)
  * [Mocha](https://github.com/mochajs/mocha)

## Tests

To run the test suite, first install the dependencies, then run `npm test`:

```bash
$ npm install
$ npm test
```

To check the coverage:

```bash
$ npm run test:coverage
```

## License

  [MIT](LICENSE)
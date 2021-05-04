# Documentation

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

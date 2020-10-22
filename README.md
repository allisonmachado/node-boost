# Yet another Nodejs backend template (0.0.1)

The objective of this project is to create a minimalist template of backend REST application.

## Why
I want to create a clean and simple template that put into action a layered architecture with well-defined responsibilities to be able to accomodate a source code base that may grow big as time passes. Those layers listed from high level to low level are:

1. ./src/middleware: this is a chain of processing that first interacts with the request and can block or add info to it.
2. ./src/controllers: this layer accepts a request, invoke the underlying processing, and respond according to the result of the processing.
3. ./src/business: this layer performs some business related processing and the business rules. 
4. ./src/data: this layer contains elements responsible for providing access to an information source, such as a relational database in this case mysql given as an example.
5. ./src/lib: this is a set of code shared among multiple distincs parts of the application and provide small reusable units.

## How
To enable a good implementation of these layers, and to simplify the writing of tests, this template applies the concept of Inversion of Control levereged by the power Typescript language.

Although no specific auxiliar library for IoC is being used (such as inversify for example to enable Dependency Injection), the responsibility of a DI container is written in the index.js file which is the startup point of the application. Also, loosely coupled elements can be optionally achieved through the specification of well defined interfaces.

## What

This template also provides a small and simple set of features to bootstrap the creation of a new application:

1. Simple CRUD of users
2. Simple Auth mechanism

The controller rest layer was built on top of the Express-js Framework.

The data layer exemplifies the connection to a mysql server and this template provides a Simple SQL schema initialization script.

It also includes:

1. Integration with tslint
2. Build scripts

...and more is to came! ;)

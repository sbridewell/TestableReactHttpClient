# Main title

This application is an investigation into different ways of consuming a web API service from a React application, with a focus on ease of unit testing and full code coverage. It abstracts the detail of making HTTP requests away from your React components, including handling error conditions such as not being able to contact the server. This allows component developers to concentrate on the value that their component provides, without needing to think about things like promise resolution / rejection and how to extract the headers and body from the response.

## Decisions

I made a few decisions up-front about the tools, libraries and frameworks I wanted to use for this application. [Read about the decisions I made and the reasons for them](readme/Decisions.md).

## The web API service

[The web API service, the server-side part of this application, is described here](readme/WebApiService.md).

## The client application

The client application is made up of 3 Node.js packages - quote-client, sde-httpclient and sde-reactcomponents.

### quote-client

This package is an example of how to use the sde-httpclient to make calls to a web API service (in this example, the QuoteService) from a React application. It includes components for each of the verbs GET, PUT, POST and DELETE, with controls for the user to enter information to be passed to the web API service where appropriate, and to display the response from the web API service. It also can display the component's props and state in order to make the workings more visible.

The code in this package is specific to the QuoteService.

### sde-httpclient

This package does all the hard work around making calls to a web API service, receiving the response and handling communication errors. It is not tied to any particular service.

It also includes a mock of the HttpClient class, which can be used in the unit tests of a consuming application to test whether the application is making the correct calls to the web API service, without the application's unit tests needing to mock the HTTP request mechanism themselves.

### sde-reactcomponents

This package is not strictly relevant to calling web API services in a unit testable way, instead it contains some React components used by the quote-client package, whilst avoiding cluttering the quote-client package with components which aren't necessary in order to call a web API service.

## Getting started

So, you've cloned or downloaded this repository and used [NPM](https://docs.npmjs.com/) or [Yarn](https://yarnpkg.com/) to install the dependencies? Let's get started.

There are 3 packages in this application. Because none of them are published on NPM, you can't use NPM to manage their relationships. Instead you need to tell one package where to find the others. From the root folder of the applcation run the following commands:

```
cd sde-httpclient
npm link
cd ../sde-reactcomponents
npm link
cd ../quote-client
npm link sde-httpclient
npm link sde-reactcomponents
```

The quote-client package makes use of both the sde-httpclient and the sde-reactcomponents packages, so these commands allow quote-client to reference sde-httpclient and sde-reactcomponents.

## Running the application

First you need to build and start the web API service using a .net IDE such as [Visual Studio 2019 Community Edition](https://visualstudio.microsoft.com/vs/).

Open a Node.js command prompt in the root folder of the client application. The following scripts are available.

`npm start`

Opens the client application in a new browser window.

`npm test`

Starts the test runner, runs all the tests, and watches for changes to the source code, re-running any tests which are relevant to the change.

`npm run codecoverage`

Like `npm test`, but also analyses the code coverage of the tests. A code coverage report showing which lines are / aren't covered can be found in the coverage folder.

`npm run lint`

Runs code analysis on the client application using [ESLint](https://eslint.org).

Now you can [use sde-httpclient in your own application](readme/Consuming.md).
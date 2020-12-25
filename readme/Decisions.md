# Decisions

## Web API service

I won't say much about the web API service being consumed by the client application, because this project is about how to write and unit test client applications, not about how to write server applications. After all, the beauty of a web service is that the client doesn't care how the server is implemented, and the server doesn't care how the client is implemented. However, some explanation of the server application helps to put the client application into context.

### ASP.net MVC Core and .net Core

The web API service is written in C# using the .net Core framework and the Model-View-Controller pattern. Because it's a web API rather than a UI, it doesn't have any views and serves data rather than web pages to the client, but the models and controllers play the same role as they do in a MVC UI project.

The functionality of the web API service is described in the [web API service](WebApiService.md) page.

### Swagger / Swashbuckle

## Client application

### React

[React.js](https://reactjs.org) is a NPM library for building UI components using a combination of JSX (XML-style markup embedded in JavaScript) and JavaScript. I chose to use React purely because it's a library I have some previous experience of.

Alternatives that I could have used include [Ember.js](https://emberjs.com), [Angular](https://angular.io) and [Vue.js](https://vuejs.org).

### create-react-app

JSX must be transpiled to JavaScript before it can be served to the browser. [Create-react-app](https://create-react-app.dev/) can be used to create a working React application from a single command, with [Babel](https://babejs.io) and [Webpack](https://webpack.js.org) already set up to perform the required transpiling, bundling and minification. Using Babel to transpile also allows me to write my components using [ES6](https://www.w3schools.com/js/js_es6.asp) features such as classes, without worrying about whether the user's browser supports those features.

### Bootstrap

[Bootstrap](https://getbootstrap.com/) isn't at all essential to this project, but it causes HTML elements to be rendered in a much more visually pleasing way than the default, with a minimum of additional markup, and it makes the UI more likely to render in a consistent way across different browsers.

### Redux

I could have used [Redux](https://redux.js.org) but I wanted to avoid using it, as I find the process of mapping state to props and dispatch to props less than intuitive.

## Testing

Unit testing is a big part of the reason I started this project in the first place.

### Jest

[Jest](https://jestjs.io) is a unit testing framework for JavaScript and Node.js, providing a test runner, assertion, setup, teardown and mocking functions. It can run unit tests automatically whenever source code or unit test files are changed, using a script added to the application by create-react-app. [Jest is recommended by the React team](https://reactjs.org/docs/testing.html#tools).

Alternatives include [AVA](https://github.com/avajs/ava), [Jasmine](https://jasmine.github.io), and [Mocha](https://mochajs.org).

### Testing Library

[React Testing Library](https://testing-library.com/) is also [recommended by the React team](https://reactjs.org/docs/testing.html#tools). Testing Library provides functions for testing UI components, and I really like their guiding principle:

> The more your tests resemble the way your software is used, the more confidence they can give you

For example, a test could select a button based on the button text, fire a click event on that button, and then assert that another element with specified text exists in the document.

I have previously tried using [react-test-renderer](https://reactjs.org/docs/shallow-renderer.html) and [react-test-renderer/shallow](https://reactjs.org/docs/shallow-renderer.html) but found Testing Library easier to use.

## Tools

### draw.io

The diagrams in these readme file were created using draw.io.
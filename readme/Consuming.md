# Consuming sde-httpclient

First, I ought to point out that you wouldn't want to use this package as-is in a production application, because it uses two different ways of making HTTP requests - the [Axios](https://www.npmjs.com/package/axios) package and JavaScript's [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch). In a real-life application you'd choose one of these, or some alternative such as [jQuery's Ajax API](https://api.jquery.com/category/ajax/), and use it wherever your application needs to make HTTP requests. I've implemented sde-httpclient using both axios and fetch to demonstrate how the same pattern can be used reglardless of the means of actually making the HTTP request.

## Import WebApiClientBase and its mock into your application

Rather than importing this class from sde-httpclient directly into any files which use it, import it into a file on its own and re-export it, and in the files which use it, import it from this location.

```js
// _imported/WebApiClientBase.js
import {WebApiClientBase} from 'sde-httpclient';
export default WebApiClientBase;
```

Import the mock WebApiClientBase class into a `__mocks__` subfolder of this location and re-export it.

```js
// _imported/__mocks__/WebApiClientBase.js
import {WebApiClientBaseMock} from 'sde-httpclient';
export default WebApiClientBaseMock;
```

This is necessary in order for Jest to be able to locate the mock WebApiClientBase class in your unit tests, and you need this mock in order to spy on the HTTP requests that your components are making.

## Create a client

For each endpoint you want to call, create a client class, derived from the imported WebApiClientBase class.

```js
// MyClient.js
import WebApiClientBase from './_imported/WebApiClientBase';

export default class MyClient extends WebApiClientBase {
  constructor(callbacks, httpRequestMechanism, httpLogging) {
    super('https://someservice/api/MyService', callbacks, httpRequestMechanism, httpLogging);
  }
}
```

Yep, that's all it needs to do - have a constructor which accepts 3 parameters and passes them to the base class' constructor along with the URL of the service to call.

## Using the client in a React component

### Register the client with the component

The ReactHttpClients class has a register method which helps to avoid lots of duplicated code across different components which make HTTP requests. I've chosen to call it from the componentDidMount lifecycle method, you may want to call it from a different lifecycle method depending on when in the component's lifecycle the HTTP requests are made, but you should only need to call it once per client during the lifetime of the component.

```js
// MyComponent.jsx 
import React from 'react';
import { ReactHttpClients } from 'sde-httpclient';
import MyClient from './MyClient'

export default class MyComponent extends React.Component {
  componentDidMount = () => {
    ReactHttpClients.register(this, MyClient);
  }
}
```

The register method creates an instance of the client class (please note that the second parameter is the client class itself, not an instance of the client class), and makes it a property of the component's state, with the property having the same name as the client class, but converted to camel case. So, in this example, the client class is called `MyClient`, so the instance of the client class will be called `this.state.myClient`.

### Use the client's properties in the component's render method

The client exposes a number of properties which describe the state of calls to the web API service.

* `inProgress` - true if a HTTP request has been made but a response has not been received yet and the call has not errored
* `succeeded` - true if a HTTP response in the 2xx (success) range has been received
* `failed` - true if a HTTP response outside the 2xx (success) range has been received
* `error` - an error message, populated only if an error occurred whilst making the HTTP request and no response was received
* `response` - object containing the response from the web API service, including HTTP status, headers and body

Each time the state of the call changes, the state property which holds the instance of the client class is set, triggering a call to the component's `render` method, so in the `render` method you can make use of the above properties of the client to decide how to render the component, for example if `inProgress` is true then you might want to disable any buttons which would initiate another call to the web API service, or you can test whether `error` is truthy to decide whether to display an error message.

### Component props

In the quote-client application, each component which makes HTTP requests needs a prop called `httpRequestMechanism`, which is set to either 'fetch' or 'axios', to determine which of the two to use to make HTTP requests. In a real-life application this wouldn't be needed, this is only implemented in order to allow the user to switch between the two on demand.

An optional boolean prop called `httpLogging`, if truthy, causes debug information to be written to the console at various points during the HTTP request.

## Unit testing your component

In the unit test, you need to import the component being tested, any client classes it uses, and also the WebApiClientBase class that you imported and re-exported earlier.

```js
// __tests__/MyComponent.test.js
import MyComponent from '../MyComponent';
import MyClient from '../MyClient';
import WebApiClientBase from '../_imported/WebApiClientBase';
```

And tell Jest to mock the WebApiClientBase class.

```js
jest.mock('../_imported/WebApiClientBase');
```

Although the path passed to `jest.mock` is the path to the re-exported real WebApiClientBase class, Jest knows to look in a subfolder called `__mocks__` for a file of the same name, and if it finds one, to use that class as the mock rather than creating a default mock. This means that whenever an instance of the client class is created in the unit test, its base class is the WebApiClientBase mock rather than the real WebApiClientBase.

### Mock WebApiClientBase members

To ensure that each unit test is independent of each other, call the `resetMock` static method before each test, to remove any client instances and requests which may have been created in the execution of previous tests.

```js
beforeEach = () => {
  MyClient.resetMock();
}
```

To get a reference to the client most recently used by the component, call the `getMostRecentInstance` static method. Alternatively, get an array of all the clients used by the component using the `instances` static property.

```js
const client = MyClient.getMostRecentInstance();
const clients = MyClient.instances;
```

Once you have a reference to a client, 3 instance methods allow you to simulate the lifecycle of a HTTP request.

* `mockStarted()` - simulates a request having started but not completed or errored.
* `mockCompleted(response)` - simulates a request completing and a response (either success or failure) being received from the web API service.
* `mockErrored(errorMessage)` - simulates a request erroring (i.e. no response received), for example because the client has no network connection or the web API service isn't running.

You can get the most recent HTTP request made by a client using its `getMostRecentRequest` instance method, or all requests made by a client using its `requests` instance property.

```js
const request = client.getMostRecentRequest();
const requests = client.requests;
```

For examples of how to unit test components, see the `__tests__` folder in the quote-client application.
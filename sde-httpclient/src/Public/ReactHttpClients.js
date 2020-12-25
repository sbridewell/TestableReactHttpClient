/**
 * @typedef React React.
 */

import HttpResponse from '../Utility/HttpResponse';
import {
    WebApiCallbacks,
    WebApiClientBase,
} from '../';

/* eslint-disable jsdoc/check-alignment */
/**
 * This class takes a lot of the work out of using the WebApiClientBase class in React
 * components to make HTTP requests. Example usage:
import React from 'react';
import {
    ReactHttpClients,
    WebApiClientBase,
} from 'sde-httpclient';

class FooClient extends WebApiClientBase {
    constructor (callbacks, httpRequestMechanism, httpLogging) {
        super('https://foo', callbacks, httpRequestMechanism, httpLogging);
    }
}

class FooComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        ReactHttpComponents.register(this, FooClient);
    }

    componentDidUpdate(prevProps) {
        if (this.props.httpRequestMechanism !== prevProps.httpRequestMechanism) {
            ReactHttpClients.register(this. FooClient);
        }
    }

    render() {
        const call = this.state.fooClientCall;
        if (!this.state.fooClientCall) return '';
        
        const get = function() {call.client.get()};
    
        let response;
        if (call.inProgress) {
            response = <div>Loading...</div>;
        } else if (call.error) {
            response = <div>{call.error}</div>
        } else if (call.failed) {
            response = <div>{call.response.status}</div>
        } else if (call.suceeded) {
            response = <div>{JSON.stringify(call.response.body)}</div>
        } else {
            response = '';
        }
    
        return (
            <div>
                <button className="btn btn-primary" onClick={get}>Get</button>
                {response}
            </div>
        );
}

 */
export default class ReactHttpClients {
    /**
     * Registers a web API client class with the supplied component.
     * Sets a property of the supplied component's state to an instance of a subclass of
     * WebApiClientBase which encapsulates the state of a call to the web API service.
     * The property will be named after the supplied client class, for example if the client
     * class is called FooClient, the property will be called fooClient.
     * @param {React.Component} component The component which consumes the web API service.
     * @param {class} clientClass The class which acts as a client for the web API service.
     * This should be a subclass of WebApiClientBase.
     */
    static register = (component, clientClass) => {
        const componentBaseType = Object.getPrototypeOf(component.constructor).name;
        if (componentBaseType !== 'Component') {
            const msg = `The "component" parameter should be an instance of a subclass of `
                + ` React.Component but is derived from ${componentBaseType}`;
            throw Error(msg);
        }

        const callbacks = new WebApiCallbacks(
            () => handleStarted(component, client), 
            (response) => handleCompleted(component, client, response), 
            (error) => handleErrored(component, client, error)
        );

        const constructorArgs = [
            callbacks, 
            component.props.httpRequestMechanism, 
            component.props.httpLogging
        ];
        const client = Reflect.construct(clientClass, constructorArgs);
        setComponentState(component, client);
    }
}

/**
 * Called when the call to the web API service starts.
 * @param {React.Component} component The component from which the web API service is called.
 * @param {WebApiClientBase} client Instance of a class derived from WebApiClientBase.
 */
const handleStarted = (component, client) => {
    client.inProgress = true;
    client.succeeded = false;
    client.failed = false;
    client.error = '';
    client.response = {};
    setComponentState(component, client);
};

/** 
 * Called when the web API service returns a response (which could be a
 * success or failure response).
 * @param {React.Component} component The component from which the web API service is called.
 * @param {WebApiClientBase} client Instance of a class derived from WebApiClientBase.
 * @param {HttpResponse} response The response from the server, including headers, body
 * and status.
 */
const handleCompleted = (component, client, response) => {
    const success = Math.floor(response.status / 100) === 2;
    client.inProgress = false;
    client.succeeded = success;
    client.failed = !success;
    client.error = '';
    client.response = response;
    setComponentState(component, client);
};

/**
 * Called when an error is encountered whilst attempting to call the
 * web API service.
 * @param {React.Component} component The component from which the web API service is called.
 * @param {WebApiClientBase} client Instance of a class derived from WebApiClientBase.
 * @param {string} error The error message.
 */
const handleErrored = (component, client, error) => {
    client.inProgress = false;
    client.succeeded = false;
    client.failed = false;
    client.error = error;
    client.response = {};
    setComponentState(component, client);
};

/**
 * 
 * @param {React.Component} component The component on which to set state.
 * @param {WebApiClientBase} client Instance of a class derived from WebApiClientBase.
 */
const setComponentState = (component, client) => {
    const propertyName = camelize(client.constructor.name);
    component.setState({
        [propertyName]: client,
    });
};

/**
 * @returns {string} The supplied string, converted to camelCase.
 * @param {string} str The string to convert.
 * Taken from https://stackoverflow.com/a/2970667
 */
const camelize = (str) => {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
};

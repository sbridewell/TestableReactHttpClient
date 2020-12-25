import AxiosClient from '../DerivedClients/AxiosClient';
import FetchClient from '../DerivedClients/FetchClient';

/**
 * Base class for a client which calls a web API service.
 * Create a subclass of this class for each controller / URL you want to consume.
 * This class provides a layer of abstraction which hides the actual mechanism (e.g.
 * fetch, axios or some other library) used to make the HTTP request and receive the
 * response.
 * In a real-world application, we'd only use a single HTTP request mechanism, so the
 * logic from FetchClient or AxiosClient would go into this class instead.
 */
export default class WebApiClientBase {
    /**
     * Initializes a new instance of the WebApiClientBase class.
     * @param {string} url URL of the web resource being requested.
     * @param {object} callbacks WebApiCallbacks instance which encapsulates the callbacks
     * to be called when the call to the web API service starts, succeeds or fails. 
     * @param {string} httpRequestMechanism The library or other mechanism to use to make 
     * calls to the web API service.
     * Valid values are: "fetch", "axios".
     * @param {boolean} httpLogging True to log HTTP activity to the console.
     */
    constructor(url, callbacks, httpRequestMechanism, httpLogging) {
        if (typeof url !== 'string') {
            const msg = `Parameter "url" is expected to be a string, but is of type ${typeof url}`;
            throw Error(msg);
        }

        if (typeof callbacks != 'object') {
            const msg = `Parameter "callbacks" is expected to be an object, but is of type ${typeof callbacks}`;
            throw Error(msg);
        }

        validateCallbacksMethod(callbacks.started, 'started');
        validateCallbacksMethod(callbacks.completed, 'completed');
        validateCallbacksMethod(callbacks.errored, 'errored');

        this.inProgress = false;
        this.succeeded = false;
        this.failed = false;
        this.error = '';
        this.response = {};

        switch (httpRequestMechanism)
        {
            case "fetch":
                this.client = new FetchClient(url, callbacks, httpLogging);
                break;

            case "axios":
                this.client = new AxiosClient(url, callbacks, httpLogging);
                break;

            default: {
                // The brackets around this block prevent violation of eslint no-case-declarations
                const msg = `The HTTP request mechanism "${httpRequestMechanism}" is not supported. `
                    + 'Valid values are "fetch", "axios".';
                throw Error(msg);
            }
        }
    }

    /**
     * Makes a DELETE call to the web API service.
     * @param {object} queryStringParameters Parameters to be included in the request URL.
     */
    delete = (queryStringParameters) => {
        this.client.delete(queryStringParameters);
    }

    /**
     * Makes a GET call to the web API service.
     * @param {object} queryStringParameters Parameters to be included in the request URL.
     */
    get = (queryStringParameters) => {
        this.client.get(queryStringParameters);
    }

    /**
     * Makes a POST call to the web API service.
     * @param {object} queryStringParameters Parameters to be included in the request URL.
     * @param {object} postBody Data to be included in the body of the request.
     */
    post = (queryStringParameters, postBody) => {
        this.client.post(queryStringParameters, postBody);
    }

    /**
     * Makes a PUT call to the web API service.
     * @param {object} queryStringParameters Parameters to be included in the request URL.
     * @param {object} putBody Data to be included in the body of the request.
     */
    put = (queryStringParameters, putBody) => {
        this.client.put(queryStringParameters, putBody);
    }
}

/**
 * Validates that the supplied method of the callbacks parameter exists and is a function.
 * @param {Function} method The method to validate.
 * @param {string} methodName The name of the method.
 */
function validateCallbacksMethod(method, methodName) {
    if (!method) {
        const msg = `Parameter "callbacks" does not have a "${methodName}" property.`;
        throw Error(msg);
    }

    if (typeof method != 'function') {
        const msg = `Parameter "callbacks" has a "${methodName}" property but it is a ${typeof method} when it should be a function`;
        throw Error(msg);
    }
}
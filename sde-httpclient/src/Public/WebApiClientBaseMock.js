import qs from 'qs';
import HttpLogger from '../Utility/HttpLogger';

/**
 * A mock for the WebApiClientBase class, for use in unit tests.
 * Use the static getMostRecentInstance method to get the most recently created instance of the 
 * mock.
 * Use the instance's getMostRecentRequest method to get the most recent request made using the 
 * instance.
 * To access older instances or requests, use the static instances array property and the instance
 * requests array object.
 * 
 * This class isn't held in the __mocks__ folder because it's not used as a mock in the unit tests
 * this package, instead it is exported for consuming packages to use in their unit tests.
 */
export default class WebApiClientBaseMock {
    static instances = [];

    /**
     * Initializes a new instance of the WebApiClientBaseMock class.
     * @param {string} url URL of the web resource being requested.
     * @param {object} callbacks WebApiCallbacks instance which encapsulates the callbacks
     * to be called when the call to the web API service starts, succeeds, fails or errors.
     * @param {string} httpRequestMechanism The library or other mechanism to use to make
     * calls to the web API service.
     * Valid values are: "fetch", "axios".
     * @param {boolean} httpLogging True to log requests to this mock's logger property.
     */
    constructor(url, callbacks, httpRequestMechanism, httpLogging) {
        this.url = url;
        this.callbacks = callbacks;
        this.httpRequestMechanism = httpRequestMechanism;
        this.inProgress = false;
        this.succeeded = false;
        this.failed = false;
        this.error = '';
        this.response = {};
        this.requests = [];
        WebApiClientBaseMock.instances.push(this);
        if (httpLogging) {
            this.logger = new HttpLogger();
        }
    }

    /**
     * Mocks a DELETE call to the web API service.
     * @param {object} queryStringParameters Parameters to be included in the request URL.
     */
    delete = (queryStringParameters) => {
        this.makeThisTheMostRecentInstance();
        const fullUrl = getFullUrl(this.url, queryStringParameters);
        this.requests.push({verb: 'delete', fullUrl, body: {}});
        if (this.logger) {
            this.logger.log('WebApiClientBaseMock delete', {fullUrl});
        }
    }

    /**
     * Mocks a GET call to the web API service.
     * @param {object} queryStringParameters Parameters to be included in the request URL.
     */
    get = (queryStringParameters) => {
        this.makeThisTheMostRecentInstance();
        const fullUrl = getFullUrl(this.url, queryStringParameters);
        this.requests.push({verb: 'get', fullUrl, body: {}});
        if (this.logger) {
            this.logger.log('WebApiClientBaseMock get', {fullUrl});
        }
    }

    /**
     * Makes a POST call to the web API service.
     * @param {object} queryStringParameters Parameters to be included in the request URL.
     * @param {object} postBody Data to be included in the body of the request.
     */
    post = (queryStringParameters, postBody) => {
        this.makeThisTheMostRecentInstance();
        const fullUrl = getFullUrl(this.url, queryStringParameters);
        this.requests.push({verb: 'post', fullUrl, body: postBody});
        if (this.logger) {
            this.logger.log('WebApiClientBaseMock post', {fullUrl}, {body: postBody});
        }
    }

    /**
     * Makes a PUT call to the web API service.
     * @param {object} queryStringParameters Parameters to be included in the request URL.
     * @param {object} putBody Data to be included in the body of the request.
     */
    put = (queryStringParameters, putBody) => {
        this.makeThisTheMostRecentInstance();
        const fullUrl = getFullUrl(this.url, queryStringParameters);
        this.requests.push({verb: 'put', fullUrl, body: putBody});
        if (this.logger) {
            this.logger.log('WebApiClientBaseMock put', {fullUrl}, {body: putBody});
        }
    }

    /**
     * Makes the current instance of the mock the most recent instance.
     * This is needed when a component uses multiple clients; without this the 
     * getMostRecentInstance method returns the most recently instantiated instance
     * rather than the most recently used instance.
     */
    makeThisTheMostRecentInstance = () => {
        const instances = WebApiClientBaseMock.instances;
        instances.splice(instances.indexOf(this), 1);
        instances.push(this);
    }

    /**
     * Calls the started callback.
     */
    mockStarted = () => {
        this.callbacks.started();
    }

    /**
     * Calls the completed callback.
     * @param {object} response The response from the server.
     */
    mockCompleted = (response) => {
        this.callbacks.completed(response);
    }

    /**
     * Calls the errored callback.
     * @param {string} errorMessage The error message.
     */
    mockErrored = (errorMessage) => {
        this.callbacks.errored(errorMessage);
    }

    /**
     * @returns {object} The most recently created instance of WebApiClientBaseMock.
     */
    static getMostRecentInstance = () => {
        if (this.instances.length === 0) {
            const msg = 'No mock WebApiClientBase instances have been created yet. '
                + 'This probably means you\'re not using this manual mock WebApiClientBase. '
                + 'Check WebApiClientBase is imported from a file inside your application rather '
                + 'than directly from the sde-httpclient package, both where it is used in '
                + 'production code, and also in the unit test';
            throw Error(msg);
        }
        
        return this.instances[this.instances.length - 1];
    }

    /**
     * Gets the most recent request made using the current instance of the mock.
     * @returns {object} The most recent request, in the form {
     *     verb: 'delete/get/post/put',
     *     queryStringParameters: {foo: 'bar'},
     *     body: {one: 1, two: 'two'}
     * }
     * Note that get and delete requests do not have a body, so the body property of the return
     * value will be an empty object.
     */
    getMostRecentRequest = () => {
        if (this.requests.length === 0) {
            const msg = 'No requests have been made using the current WebApiClientBaseMock instance';
            throw Error(msg);
        }

        return this.requests[this.requests.length - 1];
    }

    /**
     * Removes all instances of the mock from the instances array.
     * Call this before each test, using beforeEach or equivalent.
     */
    static resetMock = () => {
        this.instances = [];
    }
}

/**
 * @param {string} baseUrl Base URL of the web API service, without parameters.
 * @param {object} queryStringParameters Parameters to include in the URL.
 * @returns {string} The full URL including the query string.
 */
function getFullUrl(baseUrl, queryStringParameters) {
    const queryString = queryStringParameters ? `?${qs.stringify(queryStringParameters)}` : '';
    return baseUrl + queryString;
}
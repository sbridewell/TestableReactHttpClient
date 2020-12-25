import qs from 'qs';
import HttpLogger from '../Utility/HttpLogger';
import HttpRequest from '../Utility/HttpRequest';

/**
 * Base class for a client which can make HTTP requests to a web API service.
 * This class exposes handleSuccess, handleFailure and handleError methods, which
 * call the appropriate callback from the WebApiCallbacks object supplied to the
 * constructor.
 */
export default class HttpClientBase {
    /**
     * Initializes a new instance of the HttpClientBase class.
     * @param {string} url URL of the web API service.
     * @param {object} callbacks WebApiCallbacks instance which encapsulates the callbacks.
     * @param {boolean} httpLogging True to log HTTP activity to the console.
     */
    constructor(url, callbacks, httpLogging) {
        this.callbacks = callbacks;
        this.url = url;
        if (httpLogging) {
            this.logger = new HttpLogger();
        }
    }

    /**
     * Makes a GET call to the web API service.
     * @param {object} queryStringParameters Parameters to be included in the request URL.
     */
    get = (queryStringParameters) => {
        const fullUrl = this.queryStringify(this.url, queryStringParameters);
        const verb = 'GET';
        const headers = {};
        const body = {};
        const request = new HttpRequest(verb, fullUrl, headers, body);
        this.makeHttpRequest(request);
    }

    /**
     * Makes a POST call to the web API service.
     * @param {object} queryStringParameters Parameters to be included in the request URL.
     * @param {object} postBody Data to be included in the body of the request.
     */
    post = (queryStringParameters, postBody) => {
        const fullUrl = this.queryStringify(this.url, queryStringParameters);
        const verb = 'POST';
        const headers = {
            'Content-Type': 'application/json',
        };
        const body = postBody;
        const request = new HttpRequest(verb, fullUrl, headers, body);
        this.makeHttpRequest(request);
    }

    /**
     * Makes a PUT call to the web API service.
     * @param {object} queryStringParameters Parameters to be included in the request URL.
     * @param {object} putBody Data to be included in the body of the request.
     */
    put = (queryStringParameters, putBody) => {
        const fullUrl = this.queryStringify(this.url, queryStringParameters);
        const verb = 'PUT';
        const headers = {
            'Content-Type': 'application/json',
        };
        const body = putBody;
        const request = new HttpRequest(verb, fullUrl, headers, body);
        this.makeHttpRequest(request);
    }

    /**
     * Makes a DELETE call to the web API service.
     * @param {object} queryStringParameters Parameters to be included in the request URL.
     */
    delete = (queryStringParameters) => {
        const fullUrl = this.queryStringify(this.url, queryStringParameters);
        const verb = 'DELETE';
        const headers = {};
        const body = {};
        const request = new HttpRequest(verb, fullUrl, headers, body);
        this.makeHttpRequest(request);
    }
    
    /**
     * Handles the response from the web API service call.
     * This could be a success or failure response.
     * @param {object} response The response returned from the web API service call,
     * before it has been reformatted to a common shape.
     */
    handleCompleted = async (response) => {
        const reformattedResponse = await this.reformatResponse(response);
        if (this.logger) {
            this.logger.log('makeHttpRequest completed', {response: reformattedResponse});
        }

        this.callbacks.completed(reformattedResponse);
    }

    /**
     * Handles any exception which is thrown by the web API service call.
     * @param {Error} exception The exception thrown from the call.
     */
    handleError = (exception) => {
        if (this.logger) {
            this.logger.log('makeHttpRequest errored', {exception});
        }

        let errorMessage;
        if (
            exception.message.indexOf('NetworkError') >= 0 
            || exception.message.indexOf('network error') >= 0
        ) {
            errorMessage = `Network error - web API service might not be running at ${this.url}`;
        } else {
            errorMessage = `Non-HTTP error calling web API service at ${this.url}: ${exception}`;
        }

        this.callbacks.errored(errorMessage);
    }

    /**
     * Converts the names and values of the properties of the supplied parameters object
     * to a URL including a query string containing the parameters.
     * @param {string} baseUrl The URL to append the query parameters to.
     * @param {object} parameters Object containing the parameters to be included in the
     * query string.
     * @returns {string} A URL including the URL supplied to the constructor, plus the 
     * query string in the form
     * https://hostname:port/route?name1=value1&name2=value2
     * If the supplied parameters object is falsy then a URL with no query string will be
     * returned.
     */
    queryStringify = (baseUrl, parameters) => {
        if (typeof baseUrl != 'string') {
            const error = 'The baseUrl argument should be of type string but was '
                + `${typeof baseUrl}, value ${baseUrl}.`;
            throw Error(error);
        }

        // parameters are optional, but if supplied must be an object
        if (parameters) {
            if (typeof parameters != 'object') {
                const error = 'The parameters argument should be of type object but was '
                    + `${typeof parameters}, value ${parameters}.`;
                throw Error(error);
            }
        }

        return baseUrl + (parameters ? `?${qs.stringify(parameters)}` : '');
    }
}
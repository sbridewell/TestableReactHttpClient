import Axios from 'axios';
import HttpClientBase from '../BaseClient/HttpClientBase';
import HttpResponse from '../Utility/HttpResponse';
import HttpRequest from '../Utility/HttpRequest';

/**
 * A client which can make calls to a web API service using the Axios NPM package.
 */
export default class AxiosClient extends HttpClientBase {
    /**
     * Makes a HTTP request to a web API service using the axios API.
     * Calls the started callback and awaits the HTTP request.
     * When a response is received, the HTTP status is tested, and the handleSuccess
     * or handleFailure callback is called based on whether the status represents a 
     * successful call.
     * If the promise returned by the fetch function rejects, indicating failure to
     * reach the web server, the handleError callback is called.
     * @param {HttpRequest} request The HTTP request to make.
     */
    makeHttpRequest = async (request) => {
        if (this.logger) {
            this.logger.log('makeHttpRequest started', {request});
        }

        this.callbacks.started();
        const options = {
            method: request.verb,
            headers: {},
            data: JSON.stringify(request.body),
        };

        options.headers = request.headers;

        try {
            const response = await Axios(request.url, options);
            this.handleCompleted(response);
        } catch (exception) {
            if (exception.response) {
                // We got a response from the server but the HTTP status indicates failure.
                this.handleCompleted(exception.response);
            } else {
                // We didn't get a response from the server.
                this.handleError(exception);
            }
        }
    }

    /**
     * Reformats the response from Axios to a standard shape common to all clients.
     * @param {object} response The value returned from Axios.
     * @returns {HttpResponse} The reformatted response.
     */
    reformatResponse = async (response) => {
        if (this.logger) {
            this.logger.log('AxiosClient received response', response);
        }
        return new HttpResponse(response.status, response.headers, response.data, response.config.url);
    }
}
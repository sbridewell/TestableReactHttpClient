import HttpClientBase from '../BaseClient/HttpClientBase';
import HttpResponse from '../Utility/HttpResponse';
import HttpRequest from '../Utility/HttpRequest';

/**
 * A client which can make calls to a web API service using the JavaScript Fetch API.
 */
export default class FetchClient extends HttpClientBase {
    /**
     * Makes a HTTP request to a web API service using the fetch API.
     * Calls the started callback and awaits the HTTP request.
     * When a response is received, the handleCompleted callback is called.
     * If the promise returned by the fetch function rejects, indicating failure to
     * reach the web server, the handleError callback is called.
     * @param {HttpRequest} request The HTTP request to make.
     */
    makeHttpRequest = async (request) => {
        if (this.logger) {
            this.logger.log('makeHttpRequest started', {request});
        }

        this.callbacks.started();
        try {
            const options = {
                headers: {},
                method: request.verb,
            };

            // Only POST and PUT are allowed to have a body
            if (request.verb === 'POST' || request.verb === 'PUT') {
                options.body = JSON.stringify(request.body);
            }

            options.headers = request.headers;

            // Send the request and wait for the response
            const response = await global.fetch(request.url, options);

            // Fetch doesn't throw an exception on a non-success HTTP status, so this
            // callback handles both success and failure responses.
            await this.handleCompleted(response);
        } catch (exception) {
            // We failed to reach the web API service
            this.handleError(exception);
        }
    }

    /**
     * Reformats the response from fetch to a standard shape common to all clients.
     * @param {object} response The value returned from fetch.
     * @returns {HttpResponse} The reformatted response.
     */
    reformatResponse = async (response) => {
        if (this.logger) {
            this.logger.log('FetchClient received response', response);
        }

        // A failure response might not be parsable, so avoid throwing an error whilst 
        // processing the response on the client side.
        let body;
        try {
            body = await response.json();
        } catch {
            body = {};
        }

        return new HttpResponse(response.status, response.headers, body, response.url);
    }
}
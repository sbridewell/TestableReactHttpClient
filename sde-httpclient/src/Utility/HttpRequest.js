/**
 * Class representing a HTTP request, including verb, headers and body.
 */
export default class HttpRequest {
    /**
     * Initializes a new instance of the HttpRequest class.
     * @param {string} verb "DELETE", "GET", "POST" or "PUT".
     * @param {string} url The URL of the resource to request.
     * @param {object} headers Name-value pairs to put in the request header.
     * @param {object} body The object to put in the request body.
     */
    constructor(verb, url, headers, body) {
        // validate verb
        switch (verb) {
            case 'DELETE':
            case 'GET':
            case 'POST':
            case 'PUT':
                break;

            default: {
                const msg = 'The "verb" parameter is not valid, it should be one '
                    + `of "DELETE", "GET", "POST", "PUT", but was ${verb}.`;
                throw Error(msg);
            }
        }

        // validate URL
        const urlType = typeof url;
        if (urlType !== 'string') {
            const msg = 'The "url" parameter is not valid, it should be of type '
                + `"string", but is of type "${urlType}"`;
            throw Error(msg);
        }

        // validate headers
        const headersType = typeof headers;
        if (headersType !== 'object') {
            const msg = 'The "headers" parameter should be of type "object" '
                + `but is of type "${headersType}"`;
            throw Error(msg);
        }

        // TODO: validate body?

        this.verb = verb;
        this.url = url;
        this.headers = headers;
        this.body = body;
    }
}
import DerivedClientTester from './DerivedClientTester.test';
import FetchClient from '../FetchClient';
import HttpLogger from '../../Utility/HttpLogger';
import HttpResponse from '../../Utility/HttpResponse';
import HttpRequest from '../../Utility/HttpRequest';
import WebApiCallbacks from '../../Public/WebApiCallbacks';

/**
 * This file tests the FetchClient class using a manual mock of the built-in fetch function.
 */

// We're using a mock HttpLogger for this test
jest.mock('../../Utility/HttpLogger');

// Store the real fetch so that we can restore it after we're done with the mock
const realFetch = global.fetch;

let myFetchedUrl;
let myFetchOptions;

/**
 * Replaces the real implementation of fetch with a mock implementation.
 * Based on https://stackoverflow.com/a/49653218
 * @param {number} status HTTP status to return.
 * @param {object} responseBody The body of a success response.
 * @param {boolean} networkError True to throw a network error, as if the web server can't
 * be reached or the web API service isn't running.
 * @param {boolean} otherError True to throw some error other than a NetworkError.
 */
const mockFetch = (
    status,
    responseBody,
    networkError,
    otherError
) => {
    global.fetch = jest.fn().mockImplementationOnce((fetchedUrl, fetchOptions) => {
        myFetchedUrl = fetchedUrl;
        myFetchOptions = fetchOptions;

        if (networkError) {
            throw Error('NetworkError');
        }

        if (otherError) {
            throw Error('Something went wrong');
        }

        /**
         * Set the ok property based on the required HTTP status:
         * * 1nn = information
         * * 2nn = success
         * * 3nn = redirection
         * * 4nn = client-side error
         * * 5nn = server-side error
         */
        const ok = status < 400 ? true : false;
        
        return new Promise((resolve) => {
            resolve({
                headers: {},
                ok: ok,
                status: status,
                statusText: 'Dummy HTTP status text',
                json: () => {
                    return responseBody;
                },
                url: '',
            });
        });
    });
};

/**
 * Restores the real implementation of fetch.
 */
const unmockFetch = () => {
    global.fetch = realFetch;
};

beforeEach(() => {
    DerivedClientTester.reset();
    HttpLogger.resetMock();
});

afterEach(() => {
    unmockFetch();
});

describe('The FetchClient class', () => {
    const clientConstructor = new FetchClient().constructor;
    const tester = new DerivedClientTester(clientConstructor, mockFetch);
    tester.runTheTests();

    describe('reformatResponse method', () => {
        it('returns an empty body if the response can\'t be parsed', async () => {
            // Arrange
            const callbacks = new WebApiCallbacks(() => {}, () => {}, () => {});
            const url = 'http://something';
            const client = new FetchClient(url, callbacks, false);
            const originalResponse = {
                body: undefined,
                headers: {},
                status: 400,
                statusText: 'Bad request',
                url: url,
            };
            const expectedResponse = new HttpResponse(400, {}, {}, url);

            // Act
            const response = await client.reformatResponse(originalResponse);

            // Assert
            expect(response).toStrictEqual(expectedResponse);
        });
    });

    describe('makeHttpRequest method', () => {
        it('populates the URL', async () => {
            // Arrange
            const callbacks = new WebApiCallbacks(() => {}, () => {}, () => {});
            const url = 'http://something';
            const client = new FetchClient(url, callbacks, false);
            const request = new HttpRequest('GET', url, {}, {});
            mockFetch();

            // Act
            await client.makeHttpRequest(request);

            // Assert
            expect(myFetchedUrl).toBe(url);
        });

        it('populates the request body for POST requests', async () => {
            // Arrange
            const callbacks = new WebApiCallbacks(() => {}, () => {}, () => {});
            const url = 'http://something';
            const client = new FetchClient(url, callbacks, false);
            const body = {foo: 'bar'};
            const request = new HttpRequest('POST', url, {}, body);
            const expectedBody = JSON.stringify(body);
            mockFetch();

            // Act
            await client.makeHttpRequest(request);

            // Assert
            expect(myFetchOptions.body).toBe(expectedBody);
        });

        it('populates the request body for PUT requests', async () => {
            // Arrange
            const callbacks = new WebApiCallbacks(() => {}, () => {}, () => {});
            const url = 'http://something';
            const client = new FetchClient(url, callbacks, false);
            const body = {foo: 'bar'};
            const request = new HttpRequest('PUT', url, {}, body);
            const expectedBody = JSON.stringify(body);
            mockFetch();

            // Act
            await client.makeHttpRequest(request);

            // Assert
            expect(myFetchOptions.body).toBe(expectedBody);
        });

        it('does not populate the request body for GET requests', async () => {
            // Arrange
            const callbacks = new WebApiCallbacks(() => {}, () => {}, () => {});
            const url = 'http://something';
            const client = new FetchClient(url, callbacks, false);
            const body = {foo: 'bar'};
            const request = new HttpRequest('GET', url, {}, body);
            mockFetch();

            // Act
            await client.makeHttpRequest(request);

            // Assert
            expect(myFetchOptions.body).toBeUndefined();
        });

        it('does not populate the request body for DELETE requests', async () => {
            // Arrange
            const callbacks = new WebApiCallbacks(() => {}, () => {}, () => {});
            const url = 'http://something';
            const client = new FetchClient(url, callbacks, false);
            const body = {foo: 'bar'};
            const request = new HttpRequest('DELETE', url, {}, body);
            mockFetch();

            // Act
            await client.makeHttpRequest(request);

            // Assert
            expect(myFetchOptions.body).toBeUndefined();
        });
    });
});

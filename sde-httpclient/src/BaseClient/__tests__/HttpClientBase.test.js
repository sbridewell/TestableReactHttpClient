import HttpClientBase from '../HttpClientBase';
import HttpLogger from '../../Utility/HttpLogger';
import HttpRequest from '../../Utility/HttpRequest';
import testData from '../../DerivedClients/__tests__/DerivedClientTestData';
import WebApiCallbacks from "../../Public/WebApiCallbacks";

jest.mock('../../Utility/HttpLogger');

let client;
const expectedOriginalResponse = {foo: 1};
let actualOriginalResponse;
const expectedReformattedResponse = {bar: 2};
let actualReformattedResponse;
let actualErrorMessage;

const completed = (reformattedResponse) => {
    actualReformattedResponse = reformattedResponse;
};

const errored = (errorMessage) => {
    actualErrorMessage = errorMessage;
};

beforeEach(() => {
    client = new FakeHttpClient(
        testData.baseUrl,
        new WebApiCallbacks(() => {}, completed, errored),
    );
    actualOriginalResponse = '';
    actualReformattedResponse = '';
    actualErrorMessage = null;
    HttpLogger.resetMock();
});

describe('The HttpClientBase class', () => {

    // TODO: remove experiment
    it('empty string is falsy', () => {
        expect('').toBeFalsy();
    });

    describe('constructor', () => {
        it('when logging is enabled, initialises the logger', () => {
            const callbacks = new WebApiCallbacks(() => {}, () => {}, () => {});
            const client = new HttpClientBase(testData.baseUrl, callbacks, true);
            expect(client.logger).toBeDefined();
            expect(client.logger.constructor.name).toBe('HttpLoggerMock');
        });

        it('when logging is not enabled, does not initialise the logger', () => {
            const callbacks = new WebApiCallbacks(() => {}, () => {}, () => {});
            const client = new HttpClientBase(testData.baseUrl, callbacks, false);
            expect(client.logger).not.toBeDefined();
        });
    });

    it('makes GET requests correctly', () => {
        // Arrange
        const expectedUrl = `${testData.baseUrl}${testData.expectedQueryString}`;
        const verb = 'GET';
        const headers = {};
        const body = {};
        const request = new HttpRequest(verb, expectedUrl, headers, body);

        // Act
        client.get(testData.parameters);

        // Assert
        expect(client.request).toStrictEqual(request);
    });

    it('makes POST requests correctly', () => {
        // Arrange
        const expectedUrl = `${testData.baseUrl}${testData.expectedQueryString}`;
        const expectedHeaders = {
            'Content-Type': 'application/json'
        };
        const expectedBody = testData.body;
        const expectedRequest = new HttpRequest('POST', expectedUrl, expectedHeaders, expectedBody);

        // Act
        client.post(testData.parameters, testData.body);

        // Assert
        expect(client.request).toStrictEqual(expectedRequest);
    });

    it('makes PUT requests correctly', () => {
        // Arrange
        const expectedUrl = `${testData.baseUrl}${testData.expectedQueryString}`;
        const expectedHeaders = {
            'Content-Type': 'application/json',
        };
        const expectedBody = testData.body;
        const expectedRequest = new HttpRequest('PUT', expectedUrl, expectedHeaders, expectedBody);

        // Act
        client.put(testData.parameters, testData.body);

        // Assert
        expect(client.request).toStrictEqual(expectedRequest);
    });

    it('makes DELETE requests correctly', () => {
        // Arrange
        const expectedUrl = `${testData.baseUrl}${testData.expectedQueryString}`;
        const expectedRequest = new HttpRequest('DELETE', expectedUrl, {}, {});

        // Act
        client.delete(testData.parameters);

        // Assert
        expect(client.request).toStrictEqual(expectedRequest);
    });

    describe('handleCompleted method', () => {
        it('passes the unreformatted response to the derived client\'s reformatResponse method', async () => {
            await client.handleCompleted(expectedOriginalResponse);
            expect(actualOriginalResponse).toStrictEqual(expectedOriginalResponse);
        });

        it('passes the reformatted response to the completed callback', async () => {
            await client.handleCompleted(expectedOriginalResponse);
            expect(actualReformattedResponse).toStrictEqual(expectedReformattedResponse);
        });

        it('when logging is enabled, logs the reformatted response', async () => {
            const expectedLog = [
                'makeHttpRequest completed',
                {response: expectedReformattedResponse},
            ];
            const callbacks = new WebApiCallbacks(() => {}, () => {}, () => {});
            const client = new FakeHttpClient(testData.baseUrl, callbacks, true);
            await client.handleCompleted(expectedOriginalResponse);
            expect(HttpLogger.instances).toHaveLength(1);
            const loggerInstance = HttpLogger.instances[0];
            expect(loggerInstance.logs).toHaveLength(1);
            expect(loggerInstance.logs[0]).toStrictEqual(expectedLog);
        });

        it('when logging is not enabled, does not log anything', async () => {
            const callbacks = new WebApiCallbacks(() => {}, () => {}, () => {});
            const client = new FakeHttpClient(testData.baseUrl, callbacks, false);
            await client.handleCompleted(expectedOriginalResponse);
            expect(HttpLogger.instances).toHaveLength(0);
        });
    });

    describe('handleError method', () => {
        it('when logging is disabled, does not log anything', () => {
            const callbacks = new WebApiCallbacks(() => {}, () => {}, () => {});
            const client = new FakeHttpClient(testData.baseUrl, callbacks, false);
            client.handleError(Error('something went wrong'));
            expect(HttpLogger.instances).toHaveLength(0);
        });

        it('when logging is enabled, logs the exception', () => {
            // Arrange
            const callbacks = new WebApiCallbacks(() => {}, () => {}, () => {});
            const client = new FakeHttpClient(testData.baseUrl, callbacks, true);
            const exception = Error('something went wrong');
            const expectedLog = [
                'makeHttpRequest errored',
                {exception},
            ];

            // Act
            client.handleError(exception);

            // Assert
            expect(HttpLogger.instances).toHaveLength(1);
            const loggerInstance = HttpLogger.instances[0];
            expect(loggerInstance.logs).toHaveLength(1);
            expect(loggerInstance.logs[0]).toStrictEqual(expectedLog);
        });

        it('when the error is a network error, passes the correct message to the errored callback', () => {
            // Arrange
            const callbacks = new WebApiCallbacks(() => {}, () => {}, errored);
            const client = new FakeHttpClient(testData.baseUrl, callbacks, true);
            const exception = Error('NetworkError');
            const expectedMessage = `Network error - web API service might not be running at ${testData.baseUrl}`;

            // Act
            client.handleError(exception);

            // Assert
            expect(actualErrorMessage).toBe(expectedMessage);
        });

        it('when the error is not a network error, passes the correct message to the errored callback', () => {
            // Arrange
            const callbacks = new WebApiCallbacks(() => {}, () => {}, errored);
            const client = new FakeHttpClient(testData.baseUrl, callbacks, true);
            const exception = Error('something went wrong');
            const expectedMessage = `Non-HTTP error calling web API service at ${testData.baseUrl}: ${exception}`;

            // Act
            client.handleError(exception);

            // Assert
            expect(actualErrorMessage).toBe(expectedMessage);
        });
    });

    describe('queryStringify method', () => {
        // Arrange
        const baseUrl = 'http://anyhost:333/api';

        it ('errors if the baseUrl argument is not supplied', () => {
            // Act
            const action = () => client.queryStringify();

            // Assert
            expect(action).toThrow('The baseUrl argument should be of type string but was undefined, value undefined.');
        });
    
        it('errors if the baseUrl argument is not a string', () => {
            // Act
            const action = () => client.queryStringify(1);

            // Assert
            expect(action).toThrow('The baseUrl argument should be of type string but was number, value 1.');
        });

        it ('errors if the parameters argument is not an object', () => {
            // Act
            const action = () => client.queryStringify(baseUrl, 1);

            // Assert
            expect(action).toThrow('The parameters argument should be of type object but was number, value 1.');
        });

        it('does not add a query string if the parameters argument is not supplied', () => {
            // Act
            const url = client.queryStringify(baseUrl);

            // Assert
            expect(url).toBe(baseUrl);
        });

        it('adds the correct query string if a parameters argument is supplied', () => {
            // Arrange
            const parameters = {
                foo: 'foo',
                bar: 'bar',
            };

            // Act
            const url = client.queryStringify(baseUrl, parameters);

            // Assert
            expect(url).toBe(`${baseUrl}?foo=foo&bar=bar`);
        });
    });

});

/**
 * Fake implementation of HttpClientBase which allows us to intercept the parameters passed
 * from derived clients to HttpClientBase's makeHttpRequest method.
 */
class FakeHttpClient extends HttpClientBase {
    /**
     * In the real implementation, this is where the call to the fetch / axios / whatever API is made.
     * In this fake, we just record the arguments we were given, to make them available
     * to the tests.
     * @param {HttpRequest} request The HTTP request to make.
     */
    makeHttpRequest = (request) => {
        this.request = request;
    }

    /**
     * In the real implementation, this method reformats the response to a standard shape.
     * In this fake, we just record the original response to make it available to the test,
     * and return a different arbitrary object as the reformatted response.
     * @param {object} originalResponse The unreformatted response.
     * @returns {object} The reformatted response.
     */
    reformatResponse = async (originalResponse) => {
        actualOriginalResponse = originalResponse;
        return expectedReformattedResponse;
    }
}
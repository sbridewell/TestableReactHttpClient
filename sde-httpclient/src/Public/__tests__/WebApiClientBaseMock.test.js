import WebApiClientBaseMock from '../WebApiClientBaseMock';
import WebApiCallbacks from '../WebApiCallbacks';
import HttpLogger from '../../Utility/HttpLogger';

jest.mock('../../Utility/HttpLogger');

let started;
let completed;
let errored;
const baseUrl = 'http://somehost:1234/api/fooService';
const callbacks = new WebApiCallbacks(
    () => started = true,
    () => completed = true,
    () => errored = true
);
const httpRequestMechanism = 'barpackage';
const queryStringParameters = {
    foo: 'bar',
    one: 1
};
const expectedQueryString = '?foo=bar&one=1';

beforeEach(() => {
    WebApiClientBaseMock.resetMock();
    started = false;
    completed = false;
    errored = false;
});

describe('The WebApiClientBaseMock class', () => {
    it('has an empty static instances array property', () => {
        // Arrange
        const instances = WebApiClientBaseMock.instances;

        // Assert
        expect(instances).toBeDefined();
        expect(instances).toHaveLength(0);
    });

    describe('constructor', () => {
        it('sets the instance properties', () => {
            // Arrange / Act
            const client = new WebApiClientBaseMock(baseUrl, callbacks, httpRequestMechanism);

            // Assert
            expect(client.url).toBe(baseUrl);
            expect(client.callbacks).toBe(callbacks);
            expect(client.httpRequestMechanism).toBe(httpRequestMechanism);
            expect(client.requests).toBeDefined();
            expect(client.requests).toHaveLength(0);
        });

        it('pushes the new instance onto the instances array property', () => {
            // Arrange / Act
            new WebApiClientBaseMock(baseUrl, callbacks, httpRequestMechanism);

            // Assert
            expect(WebApiClientBaseMock.instances).toHaveLength(1);
        });

        it('when called twice, pushes both instances onto the instances array property', () => {
            // Arrange / Act
            new WebApiClientBaseMock(baseUrl, callbacks, httpRequestMechanism);
            new WebApiClientBaseMock(baseUrl, callbacks, httpRequestMechanism);

            // Assert
            expect(WebApiClientBaseMock.instances).toHaveLength(2);
        });

        it('sets the logger property if httpLogging is true', () => {
            // Act
            const client = new WebApiClientBaseMock(baseUrl, callbacks, httpRequestMechanism, true);

            // Assert
            expect(client.logger).toBeDefined();
            expect(client.logger.constructor).toBeDefined();
            expect(client.logger.constructor.name).toBe('HttpLoggerMock');
        });

        it('does not set the logger property if httpLogging is false', () => {
            // Act
            const client = new WebApiClientBaseMock(baseUrl, callbacks, httpRequestMechanism, false);

            // Assert
            expect(client.logger).not.toBeDefined();
        });
    });

    describe('static getMostRecentInstance method', () => {
        it('throws when no instances have been created yet', () => {
            // Arrange / Act
            const action = () => WebApiClientBaseMock.getMostRecentInstance();

            // Assert
            expect(action).toThrow('No mock WebApiClientBase instances have been created');
        });

        it('returns the instance when only one instance has been created', () => {
            // Arrange / Act
            const expectedClient = new WebApiClientBaseMock(baseUrl, callbacks, httpRequestMechanism);

            // Act
            const actualClient = WebApiClientBaseMock.getMostRecentInstance();

            // Assert
            expect(actualClient).toBe(expectedClient);
        });

        it('returns the most recent instance when two instances have been created', () => {
            // Arrange
            const unexpectedClient = new WebApiClientBaseMock(baseUrl, callbacks, httpRequestMechanism);
            const expectedClient = new WebApiClientBaseMock(baseUrl, callbacks, httpRequestMechanism);

            // Act
            const actualClient = WebApiClientBaseMock.getMostRecentInstance();

            // Assert
            expect(actualClient).toBe(expectedClient);
            expect(actualClient).not.toBe(unexpectedClient);
        });

        it('returns the most recently used instance when there are multiple instances', () => {
            // Arrange
            const client1 = new WebApiClientBaseMock(baseUrl, callbacks, httpRequestMechanism);
            const client2 = new WebApiClientBaseMock(baseUrl, callbacks, httpRequestMechanism);
            const client3 = new WebApiClientBaseMock(baseUrl, callbacks, httpRequestMechanism);
            client1.get();
            client3.get();
            client2.get();

            // Act
            const actualClient = WebApiClientBaseMock.getMostRecentInstance();

            // Assert
            expect(actualClient).toBe(client2);
        });
    });

    describe('getMostRecentRequest method', () => {
        it('throws when no requests have been made yet', () => {
            // Arrange
            const client = new WebApiClientBaseMock(baseUrl, callbacks, httpRequestMechanism);

            // Act
            const action = () => client.getMostRecentRequest();

            // Assert
            expect(action).toThrow('No requests have been made using the current WebApiClientBaseMock instance');
        });

        it('returns the request when only one request has been made', () => {
            // Arrange
            const client = new WebApiClientBaseMock(baseUrl, callbacks, httpRequestMechanism);
            client.delete({requestId: 42});

            // Act
            const request = client.getMostRecentRequest();

            // Assert
            expect(request.verb).toBe('delete');
            expect(request.fullUrl).toBe(`${baseUrl}?requestId=42`);
            expect(request.body).toStrictEqual({});
        });

        it('returns the most recent request when two requests have been made', () => {
            // Arrange
            const client = new WebApiClientBaseMock(baseUrl, callbacks, httpRequestMechanism);
            client.get({requestId: 43});
            const body = {foo: 'foo'};
            client.post({requestId: 44}, body);

            // Act
            const request = client.getMostRecentRequest();

            // Assert
            expect(request.verb).toBe('post');
            expect(request.fullUrl).toBe(`${baseUrl}?requestId=44`);
            expect(request.body).toStrictEqual(body);
        });
    });

    describe('delete method', () => {
        it('pushes the request onto the requests array property', () => {
            // Arrange
            const client = new WebApiClientBaseMock(baseUrl, callbacks, httpRequestMechanism, true);
            const expectedVerb = 'delete';
            const expectedUrl = `${baseUrl}${expectedQueryString}`;
            const expectedBody = {};
            
            // Act
            client.delete(queryStringParameters);

            // Assert
            const request = client.getMostRecentRequest();
            expect(request.verb).toBe(expectedVerb);
            expect(request.fullUrl).toBe(expectedUrl);
            expect(request.body).toStrictEqual(expectedBody);
            if (client.logger) {
                const logger = HttpLogger.getMostRecentInstance();
                const logs = logger.logs;
                expect(logs).toHaveLength(1);
                const log = logs[0];
                expect(log).toHaveLength(2);
                expect(log[0]).toBe('WebApiClientBaseMock delete');
                expect(log[1]).toStrictEqual({fullUrl: expectedUrl});
            }
        });

        it('does not append a query string when there are no parameters', () => {
            // Arrange
            const client = new WebApiClientBaseMock(baseUrl, callbacks, httpRequestMechanism);
            const expectedVerb = 'delete';
            const expectedUrl = `${baseUrl}`;
            const expectedBody = {};
            
            // Act
            client.delete();

            // Assert
            const request = client.getMostRecentRequest();
            expect(request.verb).toBe(expectedVerb);
            expect(request.fullUrl).toBe(expectedUrl);
            expect(request.body).toStrictEqual(expectedBody);
        });
    });

    describe('get method', () => {
        it('pushes the request onto the requests array property', () => {
            // Arrange
            const client = new WebApiClientBaseMock(baseUrl, callbacks, httpRequestMechanism, true);
            const expectedVerb = 'get';
            const expectedUrl = `${baseUrl}${expectedQueryString}`;
            const expectedBody = {};
            
            // Act
            client.get(queryStringParameters);

            // Assert
            const request = client.getMostRecentRequest();
            expect(request.verb).toBe(expectedVerb);
            expect(request.fullUrl).toBe(expectedUrl);
            expect(request.body).toStrictEqual(expectedBody);
            if (client.logger) {
                const logger = HttpLogger.getMostRecentInstance();
                const logs = logger.logs;
                expect(logs).toHaveLength(1);
                const log = logs[0];
                expect(log).toHaveLength(2);
                expect(log[0]).toBe('WebApiClientBaseMock get');
                expect(log[1]).toStrictEqual({fullUrl: expectedUrl});
            }
        });

        it('does not append a query string when there are no parameters', () => {
            // Arrange
            const client = new WebApiClientBaseMock(baseUrl, callbacks, httpRequestMechanism);
            const expectedVerb = 'get';
            const expectedUrl = `${baseUrl}`;
            const expectedBody = {};
            
            // Act
            client.get();

            // Assert
            const request = client.getMostRecentRequest();
            expect(request.verb).toBe(expectedVerb);
            expect(request.fullUrl).toBe(expectedUrl);
            expect(request.body).toStrictEqual(expectedBody);
        });
    });

    describe('post method', () => {
        it('pushes the request onto the requests array property', () => {
            // Arrange
            const client = new WebApiClientBaseMock(baseUrl, callbacks, httpRequestMechanism, true);
            const expectedVerb = 'post';
            const expectedUrl = `${baseUrl}${expectedQueryString}`;
            const expectedBody = {p1: 1, p2: 'two'};
            
            // Act
            client.post(queryStringParameters, expectedBody);

            // Assert
            const request = client.getMostRecentRequest();
            expect(request.verb).toBe(expectedVerb);
            expect(request.fullUrl).toBe(expectedUrl);
            expect(request.body).toStrictEqual(expectedBody);
            if (client.logger) {
                const logger = HttpLogger.getMostRecentInstance();
                const logs = logger.logs;
                expect(logs).toHaveLength(1);
                const log = logs[0];
                expect(log).toHaveLength(3);
                expect(log[0]).toBe('WebApiClientBaseMock post');
                expect(log[1]).toStrictEqual({fullUrl: expectedUrl});
                expect(log[2]).toStrictEqual({body: expectedBody});
            }
        });

        it('does not append a query string when there are no parameters', () => {
            // Arrange
            const client = new WebApiClientBaseMock(baseUrl, callbacks, httpRequestMechanism);
            const expectedVerb = 'post';
            const expectedUrl = `${baseUrl}`;
            const expectedBody = {p1: 1, p2: 'two'};
            
            // Act
            client.post(null, expectedBody);

            // Assert
            const request = client.getMostRecentRequest();
            expect(request.verb).toBe(expectedVerb);
            expect(request.fullUrl).toBe(expectedUrl);
            expect(request.body).toStrictEqual(expectedBody);
        });
    });

    describe('put method', () => {
        it('pushes the request onto the requests array property', () => {
            // Arrange
            const client = new WebApiClientBaseMock(baseUrl, callbacks, httpRequestMechanism, true);
            const expectedVerb = 'put';
            const expectedUrl = `${baseUrl}${expectedQueryString}`;
            const expectedBody = {a: 'b', c: 'd'};
            
            // Act
            client.put(queryStringParameters, expectedBody);

            // Assert
            const request = client.getMostRecentRequest();
            expect(request.verb).toBe(expectedVerb);
            expect(request.fullUrl).toBe(expectedUrl);
            expect(request.body).toStrictEqual(expectedBody);
            if (client.logger) {
                const logger = HttpLogger.getMostRecentInstance();
                const logs = logger.logs;
                expect(logs).toHaveLength(1);
                const log = logs[0];
                expect(log).toHaveLength(3);
                expect(log[0]).toBe('WebApiClientBaseMock put');
                expect(log[1]).toStrictEqual({fullUrl: expectedUrl});
                expect(log[2]).toStrictEqual({body: expectedBody});
            }
        });

        it('does not append a query string when there are no parameters', () => {
            // Arrange
            const client = new WebApiClientBaseMock(baseUrl, callbacks, httpRequestMechanism);
            const expectedVerb = 'put';
            const expectedUrl = `${baseUrl}`;
            const expectedBody = {p1: 1, p2: 'two'};
            
            // Act
            client.put(null, expectedBody);

            // Assert
            const request = client.getMostRecentRequest();
            expect(request.verb).toBe(expectedVerb);
            expect(request.fullUrl).toBe(expectedUrl);
            expect(request.body).toStrictEqual(expectedBody);
        });
    });

    describe('mockStarted method', () => {
        it('calls the started callback', () => {
            // Arrange
            var client = new WebApiClientBaseMock(baseUrl, callbacks, httpRequestMechanism);

            // Act
            client.mockStarted();

            // Assert
            expect(started).toBeTruthy();
            expect(completed).toBeFalsy();
            expect(errored).toBeFalsy();
        });
    });

    describe('mockCompleted method', () => {
        it('calls the completed callback', () => {
            // Arrange
            var client = new WebApiClientBaseMock(baseUrl, callbacks, httpRequestMechanism);

            // Act
            client.mockCompleted();

            // Assert
            expect(completed).toBeTruthy();
            expect(errored).toBeFalsy();
        });
    });

    describe('mockErrored method', () => {
        it('calls the errored callback', () => {
            // Arrange
            var client = new WebApiClientBaseMock(baseUrl, callbacks, httpRequestMechanism);

            // Act
            client.mockErrored();

            // Assert
            expect(completed).toBeFalsy();
            expect(errored).toBeTruthy();
        });
    });
});

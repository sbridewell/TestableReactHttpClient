import WebApiCallbacks from '../WebApiCallbacks';
import WebApiClientBase from '../WebApiClientBase';

describe('The WebApiClientBase class', () => {
    // Arrange
    const url = 'http://someurl';
    const callbacks = new WebApiCallbacks(
        () => {return true;},
        () => {return true;},
        () => {return true;}
    );

    describe('constructor', () => {

        const test = (httpRequestMechanism, clientName) => {

            // Act
            const client = new WebApiClientBase(url, callbacks, httpRequestMechanism);

            // Assert
            expect(client.client.url).toBe(url);
            expect(client.client.callbacks).toBe(callbacks);
            expect(client.client.constructor.name).toBe(clientName);
        };

        it('using fetch', () => {
            test('fetch', 'FetchClient');
        });

        it('using axios', () => {
            test('axios', 'AxiosClient');
        });

        it('with an invalid mechanism', () => {
            // Act
            const action = () => new WebApiClientBase(url, callbacks, 'foo');

            // Assert
            expect(action).toThrow('"foo" is not supported');
        });

        it('with a non-string url', () => {
            // Act
            const action = () => new WebApiClientBase(1, callbacks, 'axios');

            // Assert
            expect(action).toThrow('"url" is expected to be a string, but is of type number');
        });

        it('with non-object callbacks', () => {
            // Act
            const action = () => new WebApiClientBase(url, 'foo', 'axios');

            // Assert
            expect(action).toThrow('"callbacks" is expected to be an object, but is of type string');
        });

        describe('with callbacks', () => {
            it('with no started function', () => {
                // Arrange
                let badCallbacks = {};
                Object.assign(badCallbacks, callbacks, {});
                Reflect.deleteProperty(badCallbacks, 'started');

                // Act
                const action = () => new WebApiClientBase(url, badCallbacks, 'axios');

                // Assert
                expect(action).toThrow('"callbacks" does not have a "started" property');
            });

            it('where started is not a function', () => {
                // Arrange
                let badCallbacks = {};
                Object.assign(badCallbacks, callbacks, {});
                Reflect.set(badCallbacks, 'started', 'foo');

                // Act
                const action = () => new WebApiClientBase(url, badCallbacks, 'axios');

                // Assert
                expect(action).toThrow('Parameter "callbacks" has a "started" property but it is a string when it should be a function');
            });

            it('with no completed function', () => {
                // Arrange
                let badCallbacks = {};
                Object.assign(badCallbacks, callbacks, {});
                Reflect.deleteProperty(badCallbacks, 'completed');
        
                // Act
                const action = () => new WebApiClientBase(url, badCallbacks, 'axios');
        
                // Assert
                expect(action).toThrow('"callbacks" does not have a "completed" property');
            });
        
            it('where completed is not a function', () => {
                // Arrange
                let badCallbacks = {};
                Object.assign(badCallbacks, callbacks, {});
                Reflect.set(badCallbacks, 'completed', 'foo');
        
                // Act
                const action = () => new WebApiClientBase(url, badCallbacks, 'axios');
        
                // Assert
                expect(action).toThrow('Parameter "callbacks" has a "completed" property but it is a string when it should be a function');
            });
        
            it('with no errored function', () => {
                // Arrange
                let badCallbacks = {};
                Object.assign(badCallbacks, callbacks, {});
                Reflect.deleteProperty(badCallbacks, 'errored');
        
                // Act
                const action = () => new WebApiClientBase(url, badCallbacks, 'axios');
        
                // Assert
                expect(action).toThrow('"callbacks" does not have a "errored" property');
            });
        
            it('where errored is not a function', () => {
                // Arrange
                let badCallbacks = {};
                Object.assign(badCallbacks, callbacks, {});
                Reflect.set(badCallbacks, 'errored', 'foo');
        
                // Act
                const action = () => new WebApiClientBase(url, badCallbacks, 'axios');
        
                // Assert
                expect(action).toThrow('Parameter "callbacks" has a "errored" property but it is a string when it should be a function');
            });
        });
    });

    it('DELETEs', () => {
        // Arrange
        const queryStringParameters = {foo: 'foo', bar: 'bar'};
        const client = new FakeWebApiClient(url, callbacks);

        // Act
        client.delete(queryStringParameters);

        // Assert
        expect(client.client.calls).toHaveLength(1);
        expect(client.client.calls[0]).toStrictEqual({
            method: 'delete',
            queryStringParameters,
        });
    });

    it('GETs', () => {
        // Arrange
        const queryStringParameters = {foo: 'foo', bar: 'bar'};
        const client = new FakeWebApiClient(url, callbacks);

        // Act
        client.get(queryStringParameters);

        // Assert
        expect(client.client.calls).toHaveLength(1);
        expect(client.client.calls[0]).toStrictEqual({
            method: 'get',
            queryStringParameters
        });
    });

    it('POSTs', () => {
        // Arrange
        const queryStringParameters = {foo: 'foo', bar: 'bar'};
        const postBody = {data1: 1, data2: 'two'};
        const client = new FakeWebApiClient(url, callbacks);

        // Act
        client.post(queryStringParameters, postBody);

        // Assert
        expect(client.client.calls).toHaveLength(1);
        expect(client.client.calls[0]).toStrictEqual({
            method: 'post',
            queryStringParameters,
            postBody
        });
    });

    it('PUTs', () => {
        // Arrange
        const queryStringParameters = {foo: 'foo', bar: 'bar'};
        const putBody = {data1: 1, data2: 'two'};
        const client = new FakeWebApiClient(url, callbacks);

        // Act
        client.put(queryStringParameters, putBody);

        // Assert
        expect(client.client.calls).toHaveLength(1);
        expect(client.client.calls[0]).toStrictEqual({
            method: 'put',
            queryStringParameters,
            putBody
        });
    });
});

/**
 * Fake subclass of WebApiClientBase that we can test with so that the tests are a more
 * realistic representation of how the class would be used in real life.
 * We could directly instantiate WebApiClientBase in the tests, but that would be misleading.
 */
class FakeWebApiClient extends WebApiClientBase {
    /**
     * Initilizes a new instance of the FakeWebApiClient class.
     * @param {string} url The URL of the controller to call.
     * @param {WebApiCallbacks} callbacks WebApiCallbacks instance containing the
     * methods to call when the web API service call starts, succeeds or fails.
     */
    constructor(url, callbacks) {
        super(url, callbacks, 'fetch');
        this.client = new LogForTestingClient();
    }
}

/**
 * A mechanism client which doesn't actually make HTTP calls, instead it just logs the verb
 * and any data passed.
 */
class LogForTestingClient {
    /**
     * Initializes a new instance of the LogForTestingClient class.
     */
    constructor() {
        this.calls = [];
    }

    /**
     * Simulates a DELETE call to a web API service.
     * @param {object} queryStringParameters Parameters to be included in the request URL.
     */
    delete = (queryStringParameters) => {
        this.calls.push({method: 'delete', queryStringParameters});
    }

    /**
     * Simulates a GET call to a web API service.
     * @param {object} queryStringParameters Parameters to be included in the request URL.
     */
    get = (queryStringParameters) => {
        this.calls.push({method: 'get', queryStringParameters});
    }

    /**
     * Simulates a POST call to a web API service.
     * @param {object} queryStringParameters Parameters to be included in the request URL.
     * @param {object} postBody Data to be included in the body of the request.
     */
    post = (queryStringParameters, postBody) => {
        this.calls.push({method: 'post', queryStringParameters, postBody});
    }

    /**
     * Simulates a PUT call to a web API service.
     * @param {object} queryStringParameters Parameters to be included in the request URL.
     * @param {object} putBody Data to be included in the body of the request.
     */
    put = (queryStringParameters, putBody) => {
        this.calls.push({method: 'put', queryStringParameters, putBody});
    }
}
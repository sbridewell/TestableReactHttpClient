import HttpLogger from '../../Utility/HttpLogger';
import WebApiCallbacks from '../../Public/WebApiCallbacks';
import HttpRequest from '../../Utility/HttpRequest';

jest.mock('../../Utility/HttpLogger');

it('contains some tests', () => {});

// Flags to be set by each of the callbacks
let iStarted;
let iCompleted;
let iErrored;

// The actual body of a success response
let myResponse;

// The message from a failure response
let errorMessage;

// The 3 callbacks to pass to makeHttpRequest
const started = () => { 
    iStarted = true; 
};
const completed = (response) => {
    iCompleted = true;
    myResponse = response;
};
const errored = (message) => {
    iErrored = true;
    errorMessage = message;
};
const callbacks = new WebApiCallbacks(started, completed, errored);

const url = 'http://someurl/someroute';

// The message we expect the client to log when reformatting a response
const expectedResponseRegex = /[Fetch|Axios|Xhr]Client received response/;

beforeEach(() => {
    iStarted = false;
    iCompleted = false;
    iErrored = false;
    myResponse = undefined;
});

/**
 * Contains code which is common to testing both the client and the FetchClient, and any
 * other clients which are implemented later.
 */
export default class DerivedClientTester {
    /**
     * Initializes a new instance of the DerivedClientTester class.
     * @param {Function} clientConstructor The constructor of the client class being tested.
     * For example, for the FetchClient, this is returned by new FetchClient().constructor.
     * @param {Function} mockingFunction A function which mocks the request mechanism used by the
     * client class being tested (e.g. fetch or axios).
     */
    constructor(clientConstructor, mockingFunction) {
        validateArguments(clientConstructor, mockingFunction);
        this.clientConstructor = clientConstructor;
        this.mockingFunction = mockingFunction;
    }

    /**
     * Runs each of the unit tests twice; once with logging enabled and once with logging disabled.
     */
    runTheTests = () => {
        describe('when logging is enabled', () => {
            this.runTests(true);
        });

        describe('when logging is disabled', () => {
            this.runTests(false);
        });
    }

    /**
     * Runs each of the unit tests once.
     * @param {boolean} httpLogging Whether or not logging to the console is enabled.
     * @private
     */
    runTests = (httpLogging) => {
        this.whenAwaitedCanFetchAViewModel(httpLogging);
        this.whenNotAwaitedIsInProgress(httpLogging);
        this.whenResponseIsFailureReturnsAResponse(httpLogging);
        this.whenNetworkErrorReturnsAnError(httpLogging);
        this.whenNonNetworkErrorReturnsAnError(httpLogging);
    }

    /**
     * Tests the happy path case where the web API service returns a success response, and
     * the call is awaited so that we can see the response.
     * @param {boolean} httpLogging Whether or not logging to the console is enabled.
     * @private
     */
    whenAwaitedCanFetchAViewModel = (httpLogging) => {
        it('when awaited, can fetch a view model', async () => {
            // Arrange
            const client = new this.clientConstructor(url, callbacks, httpLogging);
            const expectedBody = {
                foo: 'foo',
                bar: {one: 'one', two: 2}
            };
            const httpStatus = 200;
            const throwNetworkError = false;
            const throwNonNetworkError = false;
            const expectedRequest = {
                request: new HttpRequest('GET', url, {}, expectedBody)
            };
            this.mockingFunction(httpStatus, expectedBody, throwNetworkError, throwNonNetworkError);

            // Act
            await client.makeHttpRequest(expectedRequest.request);

            // Assert
            expect(iStarted).toBeTruthy();
            expect(iCompleted).toBeTruthy();
            expect(iErrored).toBeFalsy();
            expect(myResponse).toBeDefined();
            expect(myResponse.body).toStrictEqual(expectedBody);
            expect(myResponse.status).toBe(httpStatus);
            expect(myResponse.headers).toStrictEqual({});
            expect(errorMessage).not.toBeDefined();
            if (httpLogging) {
                const logger = HttpLogger.getMostRecentInstance();
                const logs = logger.logs;
                let log;
                expect(logs).toHaveLength(3);

                log = 0;
                expect(logs[log]).toHaveLength(2);
                expect(logs[log][0]).toBe('makeHttpRequest started');
                expect(logs[log][1]).toStrictEqual(expectedRequest);

                log++;
                expect(logs[log]).toHaveLength(2);
                expect(logs[log][0]).toEqual(expect.stringMatching(expectedResponseRegex));
                expect(logs[log][1]).toBeDefined();

                log++;
                expect(logs[log]).toHaveLength(2);
                expect(logs[log][0]).toBe('makeHttpRequest completed');
                expect(logs[log][1].response).toBeDefined();
                expect(logs[log][1].response.body).toStrictEqual(expectedBody);
                expect(logs[log][1].response.headers).toStrictEqual({});
                expect(logs[log][1].response.status).toBe(httpStatus);
            } else {
                expect(HttpLogger.instances).toHaveLength(0);
            }
        });
    };

    /**
     * Tests the happy path case where the web API service returns a success response, and
     * the call is not awaited so that we can see class's state whilst the call is in progress.
     * @param {boolean} httpLogging Whether or not logging to the console is enabled.
     * @private
     */
    whenNotAwaitedIsInProgress = (httpLogging) => {
        it('when not awaited, is in progress', async () => {
            // Arrange
            const client = new this.clientConstructor(url, callbacks, httpLogging);
            const expectedBody = {
                foo: 'foo',
                bar: {one: 'one', two: 2}
            };
            const httpStatus = 200;
            const throwNetworkError = false;
            const throwNonNetworkError = false;
            const expectedRequest = {
                request: new HttpRequest('GET', url, {}, expectedBody)
            };
            this.mockingFunction(httpStatus, expectedBody, throwNetworkError, throwNonNetworkError);
    
            // Act
            client.makeHttpRequest(expectedRequest.request);
    
            // Assert
            expect(iStarted).toBeTruthy();
            expect(iCompleted).toBeFalsy();
            expect(iErrored).toBeFalsy();
            expect(myResponse).not.toBeDefined();
            expect(errorMessage).not.toBeDefined();
            if (httpLogging) {
                const logger = HttpLogger.getMostRecentInstance();
                const logs = logger.logs;
                let log;
                expect(logs).toHaveLength(1);

                log = 0;
                expect(logs[log]).toHaveLength(2);
                expect(logs[log][0]).toBe('makeHttpRequest started');
                expect(logs[log][1]).toStrictEqual(expectedRequest);
            } else {
                expect(HttpLogger.instances).toHaveLength(0);
            }
        });
    };

    /**
     * Tests the case where the web API service returns a non-success response.
     * @param {boolean} httpLogging Whether or not logging to the console is enabled.
     * @private
     */
    whenResponseIsFailureReturnsAResponse = (httpLogging) => {
        it('when the response status is failure, returns a response', async () => {
            // Arrange
            const client = new this.clientConstructor(url, callbacks, httpLogging);
            const expectedBody = {};
            const httpStatus = 404;
            const throwNetworkError = false;
            const throwNonNetworkError = false;
            const expectedRequest = {
                request: new HttpRequest('GET', url, {}, expectedBody)
            };
            this.mockingFunction(httpStatus, expectedBody, throwNetworkError, throwNonNetworkError);

            // Act
            await client.makeHttpRequest(expectedRequest.request);

            // Assert
            expect(iStarted).toBeTruthy();
            expect(iCompleted).toBeTruthy();
            expect(iErrored).toBeFalsy();
            expect(myResponse).toBeDefined();
            expect(errorMessage).not.toBeDefined();
            expect(myResponse.body).toStrictEqual(expectedBody);
            expect(myResponse.status).toBe(httpStatus);
            if (httpLogging) {
                const logger = HttpLogger.getMostRecentInstance();
                const logs = logger.logs;
                let log;
                expect(logs).toHaveLength(3);

                log = 0;
                expect(logs[log]).toHaveLength(2);
                expect(logs[log][0]).toBe('makeHttpRequest started');
                expect(logs[log][1]).toStrictEqual(expectedRequest);

                log++;
                expect(logs[log]).toHaveLength(2);
                expect(logs[log][0]).toEqual(expect.stringMatching(expectedResponseRegex));
                expect(logs[log][1]).toBeDefined();

                log++;
                expect(logs[log]).toHaveLength(2);
                expect(logs[log][0]).toBe('makeHttpRequest completed');
                // Can't check the whole response because different request mechanisms return
                // different shaped responses
                expect(logs[log][1].response.status).toBe(404);
            } else {
                expect(HttpLogger.instances).toHaveLength(0);
            }
        });
    };

    /**
     * Tests the case where a network error is returned (e.g. the client has no network connection,
     * or the web API service isn't running).
     * @param {boolean} httpLogging Whether or not logging to the console is enabled.
     * @private
     */
    whenNetworkErrorReturnsAnError = (httpLogging) => {
        it('when a network error occurs, returns an error message', async () => {
            // Arrange
            const client = new this.clientConstructor(url, callbacks, httpLogging);
            const expectedBody = undefined;
            const httpStatus = undefined;
            const throwNetworkError = true;
            const throwNonNetworkError = false;
            const expectedRequest = {
                request: new HttpRequest('GET', url, {}, expectedBody)
            };
            this.mockingFunction(httpStatus, expectedBody, throwNetworkError, throwNonNetworkError);
    
            // Act
            await client.makeHttpRequest(expectedRequest.request);
    
            // Assert
            expect(iStarted).toBeTruthy();
            expect(iCompleted).toBeFalsy();
            expect(iErrored).toBeTruthy();
            expect(myResponse).not.toBeDefined();
            expect(errorMessage).toBeDefined();
            expect(errorMessage).toBe(`Network error - web API service might not be running at ${url}`);
            if (httpLogging) {
                const logger = HttpLogger.getMostRecentInstance();
                const logs = logger.logs;
                expect(logs).toHaveLength(2);

                expect(logs[0]).toHaveLength(2);
                expect(logs[0][0]).toBe('makeHttpRequest started');
                expect(logs[0][1]).toStrictEqual(expectedRequest);

                expect(logs[1]).toHaveLength(2);
                expect(logs[1][0]).toBe('makeHttpRequest errored');
                expect(logs[1][1]).toStrictEqual({exception: Error('NetworkError')});
            } else {
                expect(HttpLogger.instances).toHaveLength(0);
            }
        });
    };

    /**
     * Tests the case where a non-network error is returned.
     * @param {boolean} httpLogging Whether or not logging to the console is enabled.
     * @private
     */
    whenNonNetworkErrorReturnsAnError = (httpLogging) => {
        it('when a non-network error occurs, returns an error message', async () => {
            // Arrange
            const client = new this.clientConstructor(url, callbacks, httpLogging);
            const expectedBody = undefined;
            const httpStatus = undefined;
            const throwNetworkError = false;
            const throwNonNetworkError = true;
            const expectedRequest = {
                request: new HttpRequest('GET', url, {}, expectedBody)
            };
            this.mockingFunction(httpStatus, expectedBody, throwNetworkError, throwNonNetworkError);
    
            // Act
            await client.makeHttpRequest(expectedRequest.request);
    
            // Assert
            expect(iStarted).toBeTruthy();
            expect(iCompleted).toBeFalsy();
            expect(iErrored).toBeTruthy();
            expect(myResponse).not.toBeDefined();
            expect(errorMessage).toBeDefined();
            expect(errorMessage).toBe(`Non-HTTP error calling web API service at ${url}: Error: Something went wrong`);
            if (httpLogging) {
                const logger = HttpLogger.getMostRecentInstance();
                const logs = logger.logs;
                expect(logs).toHaveLength(2);

                expect(logs[0]).toHaveLength(2);
                expect(logs[0][0]).toBe('makeHttpRequest started');
                expect(logs[0][1]).toStrictEqual(expectedRequest);

                expect(logs[1]).toHaveLength(2);
                expect(logs[1][0]).toBe('makeHttpRequest errored');
                expect(logs[1][1]).toStrictEqual({exception: Error('Something went wrong')});
            } else {
                expect(HttpLogger.instances).toHaveLength(0);
            }
        });
    };

    /**
     * Resets all variables ready for the next test.
     */
    static reset = () => {
        iStarted = false;
        iCompleted = false;
        iErrored = false;
        myResponse = undefined;
        errorMessage = undefined;
    }
}

const validateArguments = (clientConstructor, mockingFunction) => {
    const errors = [];
    const constructorType = typeof clientConstructor;
    if (constructorType !== 'function') {
        const msg = 'Parameter "clientConstructor" should be of type "function" but is a '
            + `${constructorType}. `
            + 'It should be the constructor of the client class under test, and can be created '
            + `using code similar to new FetchClient().constructor;`;
        errors.push(msg);
    }

    const mockingFunctionType = typeof mockingFunction;
    if (mockingFunctionType !== 'function') {
        const msg = 'Parameter "mockingFunction" should be of type "function" but is a '
            + `${mockingFunctionType}. `
            + 'It should be a function which mocks the HTTP request mechanism.';
        errors.push(msg);
    }

    if (errors.length > 0) {
        let msg = '';
        for (var error of errors) {
            msg += `${error}\n\n`;
        }

        throw Error(msg);
    }
};

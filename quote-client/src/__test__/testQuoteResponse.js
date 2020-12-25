/* eslint-disable no-undef */
/* istanbul ignore file */

/**
 * A function which tests functionality of the QuoteResponse component.
 * This can be called from test cases for components which include a QuoteResponse 
 * component in order to test the behaviour of the QuoteResponse component in the 
 * parent component.
 * The caller is expected to have mocked the WebApiClientBase class in order to provide the
 * mockStarted, mockSucceeded and mockFailed methods.
 * @param {Function} renderBasic Function which renders the component being tested,
 * without any web API callbacks having been called.
 * @param {object} webApiClientClass The mocked WebApiClientBase.
 */
export default function testQuoteResponse(renderBasic, webApiClientClass) {
    if (typeof renderBasic != 'function') {
        const msg = `The "renderBasic" parameter should be a function but is of type ${typeof renderbasic}`;
        throw Error(msg);
    }

    if (typeof webApiClientClass != 'function') {
        const msg = `The "webApiClientClass" parameter should be the mocked WebApiClientBase class `
            + `but is of type ${typeof webApiClientClass}.`;
        throw Error(msg);
    }

    it('displays nothing when the web API service call has not started', () => {
        // Arrange / Act
        const component = renderBasic();

        // Assert
        expect(component.queryByText('Loading...')).toBeNull();
        expect(component.queryByText('Quote ID:')).toBeNull();
        expect(component.queryByText('Quote: ')).toBeNull();
    });

    it('displays the loading message when the web API call starts', () => {
        // Arrange / Act
        const component = renderStarted(webApiClientClass, renderBasic);

        // Assert
        expect(component.getByText('Loading...')).not.toBeNull();
        expect(component.queryByText('Quote ID:')).toBeNull();
        expect(component.queryByText('Quote:')).toBeNull();
    });

    describe('when the call is successful', () => {
        // Arrange
        const mockResponse = {
            status: 200,
            body: {
                quoteId: 654321,
                quote: 'Response from the mock web API service'
            }
        };

        it('no longer displays a "Loading..." message', () => {
            // Act
            const component = renderCompleted(webApiClientClass, renderBasic, mockResponse);
            // Assert
            expect(component.queryByText('Loading...')).toBeNull();
        });

        it('displays a "Success!" message', () => {
            // Act
            const component = renderCompleted(webApiClientClass, renderBasic, mockResponse);
            // Assert
            expect(component.getByText('Success!')).not.toBeNull();
        });

        it('displays the quote property of the response', () => {
            // Act
            const component = renderCompleted(webApiClientClass, renderBasic, mockResponse);
            // Assert
            const quoteElement = component.getByText(`Quote: ${mockResponse.body.quote}`);
            expect(quoteElement).toBeDefined();
        });

        it ('displays the quoteId property of the response', () => {
            // Act
            const component = renderCompleted(webApiClientClass, renderBasic, mockResponse);
            // Assert
            const quoteIdElement = component.getByText(`Quote ID: ${mockResponse.body.quoteId}`);
            expect(quoteIdElement).toBeDefined();
        });
    });

    describe('when the call fails', () => {
        // Arrange
        const response = {
            headers: {},
            status: 400,
            statusText: 'Not found',
            statusDescription: 'The requested resource could not be found',
            statusCategory: 'Client error',
            body: {},
        };

        it('no longer displays a "Loading..." message', () => {
            // Act
            const component = renderCompleted(webApiClientClass, renderBasic, response);
            // Assert
            expect(component.queryByText('Loading...')).toBeNull();
        });

        it('displays a "Failed!" message', () => {
            // Act
            const component = renderCompleted(webApiClientClass, renderBasic, response);
            // Assert
            expect(component.getByText('We got a failure response from the server', {exact: false})).not.toBeNull();
        });

        it('displays the response details', ()=> {
            // Act
            const component = renderCompleted(webApiClientClass, renderBasic, response);
            // Assert
            expect(component.getByText(`HTTP status: ${response.status}`)).not.toBeNull();
            expect(component.getByText(`HTTP status text: Not found`)).not.toBeNull();
            expect(component.getByText(`HTTP status description: The requested resource could not be found`)).not.toBeNull();
            expect(component.getByText(`HTTP status category: Client error`)).not.toBeNull();
        });
    });
}

/**
 * @param {object} webApiClientClass The mocked WebApiClientBase class.
 * @param {Function} renderBasic A function which renders the component under test, with
 * no web API calls having been made.
 * @returns {object} An instance of the component under test, with a web API call in
 * progress.
 */
function renderStarted(webApiClientClass, renderBasic) {
    const component = renderBasic();
    const mockClient = webApiClientClass.getMostRecentInstance();
    mockClient.mockStarted();
    return component;
}

/**
 * @param {object} webApiClientClass The mocked WebApiClientBase class.
 * @param {Function} renderBasic A function which renders the component under test, with
 * no web API calls having been made.
 * @param {object} response The mocked response from the web API service.
 * @returns {object} An instance of the component under test, with a successful web API
 * call.
 */
function renderCompleted(webApiClientClass, renderBasic, response) {
    const component = renderBasic();
    const mockClient = webApiClientClass.getMostRecentInstance();
    mockClient.mockStarted();
    mockClient.mockCompleted(response);
    return component;
}

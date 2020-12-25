import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {
    render,
} from '@testing-library/react';

import appConfig from '../appConfig';
import SimpleGet from '../SimpleGet';
import testButtonClick from './testButtonClick';
import testQuoteResponse from './testQuoteResponse';

// Need to import WebApiClientBase from here, both in this unit test and also in the
// QuoteClient which subclasses it, otherwise our manual mock isn't used.
import WebApiClientBase from '../_imported/WebApiClientBase';

// Need to mock WebApiClientBase from the same location we imported it from
jest.mock('../_imported/WebApiClientBase');

beforeEach(() => {
    WebApiClientBase.resetMock();
});

describe('The SimpleGet component', () => {
    describe('renders the WebApiResponseView as expected', () => {
        testQuoteResponse(renderBasic, WebApiClientBase);
    });

    describe('when the web API call is in progress', () => {
        it('disables all the buttons which could cause web API calls', () => {
            // Arrange
            const component = renderBasic();
            const mockClient = WebApiClientBase.getMostRecentInstance();
            const makeSuccessCallButton = component.getByText('Make success call');
            const makeFailureCallButton = component.getByText('Make failure call');
            const makeNetworkErrorCallButton = component.getByText('Make network error call');

            // Act
            mockClient.mockStarted();

            // Assert
            expect(makeSuccessCallButton).toBeDisabled();
            expect(makeFailureCallButton).toBeDisabled();
            expect(makeNetworkErrorCallButton).toBeDisabled();
        });
    });

    describe('button', () => {
        const verb = 'get';
        const successButtonText = 'Make success call';
        it(`"${successButtonText}" calls the correct URL`, () => {
            const component = renderBasic();
            testButtonClick(
                WebApiClientBase,
                component,
                successButtonText, 
                `${appConfig.quoteControllerUrl}?id=1`,
                verb,
                {}
            );
        });

        const failureButtonText = 'Make failure call';
        it(`"${failureButtonText}" calls the correct URL`, () => {
            const component = renderBasic();
            testButtonClick(
                WebApiClientBase,
                component,
                failureButtonText, 
                appConfig.notAControllerUrl,
                verb,
                {}
            );
        });

        const networkErrorButtonText = 'Make network error call';
        it(`"${networkErrorButtonText}" calls the correct URL`, () => {
            const component = renderBasic();
            testButtonClick(
                WebApiClientBase,
                component,
                networkErrorButtonText, 
                appConfig.notListeningUrl,
                verb,
                {}
            );
        });

    });
});

/**
 * @returns {object} A SimpleGet component rendered by the testing-library render
 * function.
 */
function renderBasic() {
    const jsx = (<SimpleGet httpRequestMechanism="fetch" />);
    return render(jsx);
}
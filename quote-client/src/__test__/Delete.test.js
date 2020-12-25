import React from 'react';
import {
    fireEvent,
    render,
} from '@testing-library/react';

import appConfig from '../appConfig';
import Delete from '../Delete';
import testButtonClick from './testButtonClick';
import testQuoteResponse from './testQuoteResponse';

// Need to import WebApiClientBase from here, both in this unit test and also in the
// QuoteClient which subclasses it, otherwise our manual mock isn't used.
import WebApiClientBase from '../_imported/WebApiClientBase';

// Need to mock things from the same locations we imported them from.
jest.mock('../_imported/WebApiClientBase');

beforeEach(() => {
});

describe('The Delete component', () => {
    describe('renders the WebApiResponseView as expected', () => {
        testQuoteResponse(renderBasic, WebApiClientBase);
    });

    describe('when the web API call is in progress', () => {
        it('disables all the buttons which could cause web API calls', () => {
            // Arrange
            const component = renderBasic();
            const mockClient = WebApiClientBase.getMostRecentInstance();
            const deleteQuoteButton = component.getByText('Delete quote');

            // Act
            mockClient.mockStarted();

            // Assert
            expect(deleteQuoteButton).toBeDisabled();
        });
    });

    describe('button', () => {
        const buttonText = 'Delete quote';
        const verb = 'delete';
        for (let quoteId = 0; quoteId < 15; quoteId++) {
            it(`"${buttonText}" makes the correct request for quote ID ${quoteId}`, () => {
                const component = renderBasic();
                const quoteIdControl = component.getByLabelText('Enter quote ID');
                fireEvent.change(quoteIdControl, {target: {value: quoteId}});
                testButtonClick(
                    WebApiClientBase,
                    component,
                    buttonText,
                    `${appConfig.quoteControllerUrl}?id=${quoteId}`,
                    verb,
                    {}
                );
            });
        }
    });
});

/**
 * @returns {object} A Delete component rendered by the testing-library render
 * function.
 */
function renderBasic() {
    const jsx = (<Delete httpRequestMechanism="fetch" />);
    return render(jsx);
}
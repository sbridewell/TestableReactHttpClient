import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {
    render, fireEvent,
} from '@testing-library/react';

import appConfig from '../appConfig';
import Put from '../Put';
import testButtonClick from './testButtonClick';
import testQuoteResponse from './testQuoteResponse';

// Need to import WebApiClientBase from here, both in this unit test and also in the
// QuoteClient which subclasses it, otherwise our manual mock isn't used.
import WebApiClientBase from '../_imported/WebApiClientBase';

// Need to mock WebApiClientBase from the same location we imported it from
jest.mock('../_imported/WebApiClientBase');

describe('The Put component', () => {
    describe('renders the WebApiResponseView as expected', () => {
        testQuoteResponse(renderBasic, WebApiClientBase);
    });

    describe('when the web API call is in progress', () => {
        it('disables all the buttons which could cause web API calls', () => {
            // Arrange
            const component = renderBasic();
            const mockClient = WebApiClientBase.getMostRecentInstance();
            const createOrUpdateQuoteButton = component.getByText('Create or update quote');

            // Act
            mockClient.mockStarted();

            // Assert
            expect(createOrUpdateQuoteButton).toBeDisabled();
        });
    });

    it('makes the correct request when a quote is PUTted', () => {
        // Arrange
        const verb = 'put';
        const component = renderBasic();
        const quoteIdControl = component.getByLabelText('Enter quote ID');
        const quoteControl = component.getByLabelText('Enter quote');
        const quoteId = 99;
        const quote = 'That went as well as could be expected';
        const buttonText = 'Create or update quote';
        const expectedUrl = `${appConfig.quoteControllerUrl}?id=${quoteId}`;

        // Act
        fireEvent.change(quoteIdControl, {target: {value: quoteId}});
        fireEvent.change(quoteControl, {target: {value: quote}});

        // Assert
        testButtonClick(
            WebApiClientBase,
            component, 
            buttonText,
            expectedUrl,
            verb,
            {quote}
        );
    });
});

/**
 * @returns {object} A Put component rendered by the testing-library render
 * function.
 */
function renderBasic() {
    const jsx = (<Put httpRequestMechanism="fetch" />);
    return render(jsx);
}
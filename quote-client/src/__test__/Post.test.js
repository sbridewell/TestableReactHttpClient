import React from 'react';
import {
    render, fireEvent,
} from '@testing-library/react';

import appConfig from '../appConfig';
import Post from '../Post';
import testButtonClick from './testButtonClick';
import testQuoteResponse from './testQuoteResponse';

// Need to import WebApiClientBase from here, both in this unit test and also in the
// QuoteClient which subclasses it, otherwise our manual mock isn't used.
import WebApiClientBase from '../_imported/WebApiClientBase';

// Need to mock WebApiClientBase from the same location we imported it from
jest.mock('../_imported/WebApiClientBase');

describe('The Post component', () => {
    describe('renders the WebApiResponseView as expected', () => {
        testQuoteResponse(renderBasic, WebApiClientBase);
    });

    describe('when the web API call is in progress', () => {
        it('disables all the buttons which could cause web API calls', () => {
            // Arrange
            const component = renderBasic();
            const mockClient = WebApiClientBase.getMostRecentInstance();
            const postQuoteButton = component.getByText('Post quote');

            // Act
            mockClient.mockStarted();

            // Assert
            expect(postQuoteButton).toBeDisabled();
        });
    });

    const verb = 'post';
    it('makes the correct request when a quote is POSTed', () => {
        // Arrange
        const component = renderBasic();
        const quoteControl = component.getByLabelText('Enter quote');
        const quote = 'That\'s not a moon, it\'s a space station';
        const buttonText = 'Post quote';
        const expectedUrl = `${appConfig.quoteControllerUrl}`;

        // Act
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
 * @returns {object} A Post component rendered by the testing-library render
 * function.
 */
function renderBasic() {
    const jsx = (<Post httpRequestMechanism="fetch" />);
    return render(jsx);
}
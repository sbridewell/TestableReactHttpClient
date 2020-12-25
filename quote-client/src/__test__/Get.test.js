import React from 'react';
import {
    fireEvent,
    render, 
} from '@testing-library/react';

import appConfig from '../appConfig';
import Get from '../Get';
import testButtonClick from './testButtonClick';
import testQuoteResponse from './testQuoteResponse';

// Need to import WebApiClientBase from here, both in this unit test and also in the
// QuoteClient which subclasses it, otherwise our manual mock isn't used.
import WebApiClientBase from '../_imported/WebApiClientBase';
import QuoteClient from '../QuoteClient';

// Need to mock WebApiClientBase from the same location we imported it from
jest.mock('../_imported/WebApiClientBase');

describe('The Get component', () => {
    describe('renders the WebApiResponseView as expected', () => {
        testQuoteResponse(renderBasic, WebApiClientBase);
    });

    describe('when the web API call is in progress', () => {
        it('disables all the buttons which could cause web API calls', () => {
            // Arrange
            const component = renderBasic();
            const mockClient = QuoteClient.getMostRecentInstance();
            const getByIdButton = component.getByText('Get by ID');
            const getBySearchStringButton = component.getByText('Get by search string');
            const getByIdAndSearchStringButton = component.getByText('Get by ID and search string');

            // Act
            mockClient.mockStarted();

            // Assert
            expect(getByIdButton).toBeDisabled();
            expect(getBySearchStringButton).toBeDisabled();
            expect(getByIdAndSearchStringButton).toBeDisabled();
        });
    });

    describe('button', () => {
        const buttonText = 'Get by ID';
        const verb = 'get';
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

        const searchStrings = ['foo', 'bar', 'cheese'];
        for (let searchString of searchStrings) {
            const buttonText = 'Get by search string';
            it(`"${buttonText}" makes the correct request for search string ${searchString}`, () => {
                const component = renderBasic();
                const searchStringControl = component.getByLabelText('Enter search string');
                fireEvent.change(searchStringControl, {target: {value: searchString}});
                testButtonClick(
                    WebApiClientBase,
                    component,
                    buttonText,
                    `${appConfig.quoteControllerUrl}?searchString=${searchString}`,
                    verb,
                    {}
                );
            });
        }

        for (let searchString of searchStrings) {
            const buttonText = 'Get by ID and search string';
            for (let quoteId = 0; quoteId < 15; quoteId++) {
                it(`"${buttonText}" makes the correct request for ID ${quoteId} and search string ${searchString}`, () => {
                    const component = renderBasic();
                    const quoteIdControl = component.getByLabelText('Enter quote ID');
                    const searchStringControl = component.getByLabelText('Enter search string');
                    fireEvent.change(quoteIdControl, {target: {value: quoteId}});
                    fireEvent.change(searchStringControl, {target: {value: searchString}});
                    testButtonClick(
                        WebApiClientBase,
                        component,
                        buttonText,
                        `${appConfig.quoteControllerUrl}?id=${quoteId}&searchString=${searchString}`,
                        verb,
                        {}
                    );
                });
            }
        }
    });

});

/**
 * @returns {object} A Get component rendered by the testing-library render
 * function.
 */
function renderBasic() {
    const jsx = (<Get httpRequestMechanism="fetch" />);
    return render(jsx);
}
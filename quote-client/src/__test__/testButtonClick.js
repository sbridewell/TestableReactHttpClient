/* istanbul ignore file */

import {
    fireEvent,
} from '@testing-library/react';

/**
 * Simulates a click event on the button with the supplied text, and tests that the 
 * component makes a web API call to the supplied URL as a result.
 * @param {object} webApiClientClass The mocked WebApiClientBase class.
 * @param {object} component A React component rendered by the React test library.
 * @param {string} buttonText Text of the button to click.
 * @param {string} expectedUrl The URL we expect the component to call as a result of
 * the click, including any query string.
 * @param {string} expectedVerb The expected verb (delete, get, post or put).
 * @param {object} expectedRequestBody The expected body of the request.
 */
export default function testButtonClick(
    webApiClientClass,
    component, 
    buttonText, 
    expectedUrl, 
    expectedVerb,
    expectedRequestBody
) {
    ////////////////
    // Arrange... //
    ////////////////
    const button = component.getByText(buttonText);

    ////////////
    // Act... //
    ////////////
    fireEvent.click(button);

    ///////////////
    // Assert... //
    ///////////////

    // Get the most recent call to makeHttpRequest
    const mockClient = webApiClientClass.getMostRecentInstance();
    const request = mockClient.getMostRecentRequest();

    // Test the parameters passed to that call
    /* eslint-disable no-undef */
    expect(request.verb).toBe(expectedVerb);
    expect(request.fullUrl).toStrictEqual(expectedUrl);
    expect(request.body).toStrictEqual(expectedRequestBody);
    /* eslint-enable no-undef */
}

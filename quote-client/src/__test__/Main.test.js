import React from 'react';
import {
    render, fireEvent
} from '@testing-library/react';

/*
In a non-React project we'd add the preset targets: {esmodules: true} to Babel config, but 
create-react-app doesn't put a Babel config file in the project, so we need to import this
apparently unused module instead.
*/
/* eslint-disable no-unused-vars */
import regeneratorRuntime from 'regenerator-runtime';
/* eslint-enable no-unused-vars */

import MainView from '../MainView';

describe('The Main component', () => {
    it('simple GET button loads the SimpleGet component', () => {
        buttonRendersTheCorrectComponent('Simple GET', 'Make success call');
    });

    it('GET button loads the Get component', () => {
        buttonRendersTheCorrectComponent('GET', 'Get by ID');
    });
    
    it('PUT button loads the Put component', () => {
        buttonRendersTheCorrectComponent('PUT', 'Create or update quote');
    });
    
    it('POST button loads the Post component', () => {
        buttonRendersTheCorrectComponent('POST', 'Post quote');
    });

    it('DELETE button loads the Delete component', () => {
        buttonRendersTheCorrectComponent('DELETE', 'Delete quote');
    });
});

/**
 * 
 * @param {string} buttonText Text of the button to click.
 * @param {string} containerText The text which indicates that the correct component has
 * been rendered.
 */
const buttonRendersTheCorrectComponent = (buttonText, containerText) => {
    // Arrange
    const component = render(<MainView suppressLogging={true} />);
    const button = component.getByText(buttonText);

    // Act
    fireEvent.click(button);

    // Assert
    expect(component.getByText(containerText)).toBeDefined();
};
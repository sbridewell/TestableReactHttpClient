import React from 'react';
import {
    fireEvent,
    render,
} from '@testing-library/react';

import NumericInput from '../NumericInput';

let newValue;
const defaultValue = 99;
let textbox;

beforeEach(() => {
    const jsx = (
        <NumericInput 
            value={defaultValue}
            onChange={(event) => {
                newValue = event.target.value;
            }}
        />
    );
    const component = render(jsx);
    textbox = component.getByRole('textbox');
});

describe('The NumericInput component', () => {

    it('allows the value to be set to something numeric', () => {
        fireEvent.input(textbox, {target: {value: '1'}});

        // Check that our onChange function has been called with the expected value
        expect(newValue).toBe('1');
    });

    it('does not allow the value to be set to something non-numeric', () => {
        fireEvent.input(textbox, {target: {value: 'a'}});

        // The onChange method shouldn't have been called, so check the value of the textbox
        expect(textbox.value).toBe(defaultValue.toString());
    });

    it('sets the value to zero when all characters are deleted', () => {
        fireEvent.input(textbox, {target: {value: ''}});

        // Check that our onChange function has been called with the expected value
        expect(newValue).toBe('0');
    });
});
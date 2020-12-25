import React from 'react';
import {
    toHaveClass
} from '@testing-library/jest-dom/matchers';
import {
    render, 
    fireEvent,
} from '@testing-library/react';

import CheckBox from '../CheckBox';

expect.extend({toHaveClass});

let clicked;
const text = 'Click me!';
const tooltip = 'I am a CheckBox';

beforeEach(() => {
    clicked = false;
});

describe('The CheckBox component', () => {
    it('has the right text', () => {
        const box = renderBox();
        box.getByText(text);
    });

    it('has the right tooltip', () => {
        const box = renderBox();
        box.getByTitle(tooltip);
    });

    it('calls the onClick callback when clicked', () => {
        const box = renderBox().getByText(text);
        fireEvent.click(box);
        expect(clicked).toBeTruthy();
    });

    describe('is styled correctly', () => {
        it('when checked is true', () => {
            const box = renderBox(true).getByText(text);
            expect(box).toHaveClass('btn-primary active');
        });

        it('when checked is false', () => {
            const box = renderBox(false).getByText(text);
            expect(box).toHaveClass('btn-secondary');
        });
    });
});

/**
 * @returns {CheckBox} a CheckBox rendered by React Testing Library;
 * @param {boolean} checked Whether or not the CheckBox is checked.
 */
const renderBox = (checked = false) => {
    const jsx = (
        <CheckBox 
            text={text}
            tooltip={tooltip}
            checked={checked}
            onClick={handleClick}
        />
    );

    return render(jsx);
};

const handleClick = () => {
    clicked = true;
};
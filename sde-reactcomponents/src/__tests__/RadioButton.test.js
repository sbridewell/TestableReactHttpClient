import React from 'react';
import {
    toHaveClass,
} from '@testing-library/jest-dom/matchers';
import {
    render,
    fireEvent,
} from '@testing-library/react';

import RadioButton from '../RadioButton';

expect.extend({toHaveClass});

let clicked;
const buttonText = 'Click me';
const tooltip = 'I am a RadioButton';

beforeEach(() => {
    clicked = false;
});


describe('The RadioButton class', () => {
    it('has the right button text', () => {
        const button = renderButton();
        button.getByText(buttonText);
    });

    it('has the right tooltip', () => {
        const button = renderButton();
        button.getByTitle(tooltip);
    });

    it('calls the onClick callback when clicked', () => {
        const button = renderButton().getByText(buttonText);
        fireEvent.click(button);
        expect(clicked).toBeTruthy();
    });

    describe('is styled correctly', () => {
        it('when the active property is true', () => {
            const button = renderButton(true).getByText(buttonText);
            expect(button).toHaveClass('btn-primary active');
        });

        it('when the active property is false', () => {
            const button = renderButton(false).getByText(buttonText);
            expect(button).toHaveClass('btn-secondary');
        });
    });
});

/**
 * @param {boolean} checked Whether the RadioButton starts off checked.
 * @returns {RadioButton} A RadioButton rendered using React Testing Library.
 */
const renderButton = (checked = false) => {
    const jsx = (
        <RadioButton
            active={checked}
            buttonText={buttonText}
            tooltip={tooltip}
            onClick={handleClick}
        />
    );

    return render(jsx);
};

/**
 * Handles the onClick event.
 */
const handleClick = () => {
    clicked = true;
};
import PropTypes from 'prop-types';
import React from 'react';

/**
 * A button which implements being disabled correctly.
 * This is a workaround for the fact that Boostrap 4 doesn't change the cursor
 * to "not-allowed" when hovering over a disabled button.
 * See https://github.com/twbs/bootstrap/issues/23334
 */
export default class Button extends React.Component {
    static propTypes = {
        /** Function to call when the button is clicked */
        onClick: PropTypes.func.isRequired,

        /** True if the button is disabled */
        disabled: PropTypes.bool.isRequired,

        /** 
         * Any CSS classes to apply to the component in addition to "btn" 
         *  or "disabled"
         */
        additionalClass: PropTypes.string.isRequired,
    }

    /**
     * @returns {string} JSX describing how to render the component.
     */
    render = () => {
        const buttonClass = `btn ${this.props.disabled ? "disabled" : ""}`;
        const buttonStyle = {
            cursor: this.props.disabled ? 'not-allowed' : '',
        };

        /**
         * Allows the consumer to supply inner text in the form
         * <Button>Inner text</Button>
         * See https://stackoverflow.com/a/45472475
         */
        const innerText = this.props.children;
    
        return (
            <button
                onClick={this.props.onClick}
                className={`${buttonClass} ${this.props.additionalClass}`}
                style={buttonStyle}
                disabled={this.props.disabled}
            >
                {innerText}
            </button>
        );
    }
}
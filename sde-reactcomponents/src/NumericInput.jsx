import React from 'react';
import PropTypes from 'prop-types';

/**
 * React component which renders a text box which only allows numeric values to be 
 * entered.
 */
export default class NumericInput extends React.Component {
    static propTypes = {
        id: PropTypes.string,
        className: PropTypes.string,
        value: PropTypes.number.isRequired,
        onChange: PropTypes.func.isRequired,
    }

    /**
     * Handles the event of the user changing the value in the text box.
     * Prevents entry of non-numeric values.
     * @param {event} event The event being handled.
     */
    handleChange = (event) => {
        let newValue;
        if (event.target.value.length === 0) {
            // If the user deletes the whole value, set it to zero.
            event.target.value = 0;
            this.props.onChange(event);
        } else {
            newValue = parseInt(event.target.value);
            if (isNaN(newValue)) {
                event.preventDefault();
            } else {
                this.props.onChange(event);
            }
        }
    }

    /**
     * Called by the React runtime when the component's state changes.
     * @returns {string} JSX describing how to render the component.
     */
    render = () => {
        return (
            <input 
                type="text"
                className={this.props.className}
                id={this.props.id}
                value={this.props.value}
                onChange={this.handleChange}
            />
        );
    }
}
import React from 'react';
import PropTypes from 'prop-types';

/**
 * A radio button.
 */
export default class RadioButtonGroup extends React.Component {
    static propTypes = {
        /** True if this radio button is the active one in the group */
        active: PropTypes.bool.isRequired,

        /** Text to display on the button */
        buttonText: PropTypes.string.isRequired,

        /** Tooltip to display when the mouse is over the button */
        tooltip: PropTypes.string.isRequired,

        /** Function to call when the button is selected */
        onClick: PropTypes.func.isRequired,
    }
    
    /**
     * @returns {string} JSX describing how to render the component.
     */
    render = () => {
        const labelClass = `btn btn-sm btn-${this.props.active ? 'primary active' : 'secondary'}`;
        const jsx = (
            <label 
                className={labelClass}
                data-toggle="tooltip"
                data-placement="top"
                title={this.props.tooltip}
                onClick={this.props.onClick}
            >
                <input 
                    type="radio" 
                    name="options" 
                    id="tostring" 
                    checked={this.props.active} 
                    onChange={() => {}}
                />
                {this.props.buttonText}
            </label>
        );
    
        return jsx;
    }
}
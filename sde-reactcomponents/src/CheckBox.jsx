import React from 'react';
import PropTypes from 'prop-types';

/** A checkbox */
export default class CheckBox extends React.Component {
    /**
     * Initializes a new instance of the CheckBox component.
     * @param {object} props Data passed to the component as JSX attributes.
     */
    constructor(props) {
        super(props);
        this.checked = props.checked;
    }

    static propTypes = {
        text: PropTypes.string.isRequired,
        tooltip: PropTypes.string.isRequired,
        checked: PropTypes.bool.isRequired,
    }

    /** @returns {string} JSX describing how to render the component */
    render = () => {
        const labelClass = `btn btn-sm btn-${this.checked ? 'primary active' : 'secondary'}`;
        const jsx = (
            <label 
                className={labelClass}
                data-toggle="tootip" 
                title={this.props.tooltip}
                onClick={() => {
                    this.checked = !this.checked;
                    this.props.onClick(this.checked);
                }}
            >
                {this.props.text}
            </label>
        );
        return jsx;
    }
}
import React from 'react';
import PropTypes from 'prop-types';

import CheckBox from '../CheckBox';
import RadioButton from '../RadioButton';

/**
 * Various buttons which control the behaviour of a PropertyGrid.
 */
export default class PropertyGridControls extends React.Component {
    /** 
     * Initializes a new instance of the PropertyGridControls control.
     * @param {object} props Data passed to the component as JSX attributes.
     */
    constructor(props) {
        super(props);
        const allowedValues = ['json', 'table', 'tostring', 'none'];
        if (!allowedValues.includes(props.showObjectsAs)) {
            const msg = `The supplied value "${props.showObjectsAs}" of the prop showObjectsAs `
                + `is not valid. Allowed values are ${allowedValues.join(', ')}`;
            throw Error(msg);
        }

        this.state = {
            showFunctionDefinitions: props.showFunctionDefinitions,
        };
    }

    static propTypes = {
        /** "json", "table", "tostring" or "none" */
        showObjectsAs: PropTypes.string.isRequired,

        /**
         * Function to call when one of the radio buttons is clicked.
         */
        setShowObjectsAs: PropTypes.func.isRequired,

        /** True to display the source code of function properties */
        showFunctionDefinitions: PropTypes.bool.isRequired,

        /** 
         * Function to call when the show function definitons button is clicked.
         * Will be passed a boolean indicating whether the button is now checked.
         */
        setShowFunctionDefinitions: PropTypes.func.isRequired,

        /** 
         * True to display a button for toggling whether the source code of function 
         * properties will be displayed.
         */
        showFunctionDefinitionsButton: PropTypes.bool.isRequired,
    }

    /**
     * @returns {string} JSX describing how to render the component.
     */
    render = () => {
        const radioButtons = this.props.showObjectsAs === 'none' ? '' : (
            <div 
                id="object-buttons" 
                className="btn-group btn-group-toggle" 
                data-toggle="buttons"
            >
                <RadioButton 
                    buttonText="JSON"
                    tooltip="Show objects as JSON"
                    active={this.props.showObjectsAs === 'json'}
                    onClick={() => this.props.setShowObjectsAs('json')}
                />
                <RadioButton 
                    buttonText="Table"
                    tooltip="Show objects as an embedded table"
                    active={this.props.showObjectsAs === 'table'}
                    onClick={() => this.props.setShowObjectsAs('table')}
                />
                <RadioButton 
                    buttonText="toString"
                    tooltip="Show objects as the return value of their toString method"
                    active={this.props.showObjectsAs === 'tostring'}
                    onClick={() => this.props.setShowObjectsAs('tostring')}
                />
            </div>
        );

        const checkbox = this.props.showFunctionDefinitionsButton ? (
            <div id="function-button" className="btn-group btn-group-toggle" data-toggle="buttons">
                <CheckBox 
                    checked={this.state.showFunctionDefinitions} 
                    text="function() {}" 
                    tooltip="Show/hide function definitions" 
                    onClick={(checked) => this.props.setShowFunctionDefinitions(checked)}
                />
            </div>
        ) : '';

        const jsx = (
            <div className="float-right">
                {radioButtons}
                &nbsp;
                {checkbox}
            </div>
        );

        return jsx;
    }
}
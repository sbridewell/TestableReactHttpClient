import React from 'react';
import PropTypes from 'prop-types';

import TypeCell from './TypeCell';
import ValueCell from './ValueCell';

/**
 * A row in a PropertyGrid.
 */
export default class PropertyRow extends React.Component {
    static propTypes = {
        propertyName: PropTypes.string.isRequired,
        propertyValue: PropTypes.any,
        showObjectsAs: PropTypes.string.isRequired,
        showFunctionDefinitions: PropTypes.bool.isRequired,
    }

    /**
     * @returns {string} JSX describing how to render the component.
     */
    render = () => {
        const propertyName = this.props.propertyName;
        const propertyValue = this.props.propertyValue;
        const showObjectsAs = this.props.showObjectsAs;
        const showFunctionDefinitions = this.props.showFunctionDefinitions;

        const propertyTypeCell = (
            <TypeCell propertyValue={propertyValue} />
        );
        
        const propertyValueCell = (
            <ValueCell
                propertyValue={propertyValue} 
                showObjectsAs={showObjectsAs} 
                showFunctionDefinitions={showFunctionDefinitions} 
            />
        );

        return (
            <tr>
                <td>{propertyName}</td>
                {propertyValueCell}
                {propertyTypeCell}
            </tr>
        );
    }
}
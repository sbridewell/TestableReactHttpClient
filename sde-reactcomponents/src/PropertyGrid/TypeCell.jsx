import React from 'react';
import PropTypes from 'prop-types';

/**
 * A cell in a PropertyGrid which displays the type of a property.
 */
export default class PropertyTypeCell extends React.Component {
    static propTypes = {
        propertyValue: PropTypes.any,
    }

    /**
     * @returns {string} JSX describing how to render the component.
     */
    render = () => {
        const propertyValue = this.props.propertyValue;
        const propertyValueType = typeof propertyValue;
        let representation;
        if (propertyValue == null) {
            representation = 'null';
        } else if (propertyValueType === 'object') {
            const constructorName = propertyValue.constructor.name;
            representation = `object (${constructorName})`;
        } else {
            representation = propertyValueType;
        }

        const jsx = <td>{representation}</td>;

        return jsx;
    }
}

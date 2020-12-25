import JsonBeautify from 'json-beautify';
import React from 'react';
import PropTypes from 'prop-types';

import PropertyGrid from './PropertyGrid';

/**
 * A cell in a PropertyGrid which displays the value of a property.
 */
export default class PropertyValueCell extends React.Component {
    static propTypes = {
        /** The property value to display in the cell */
        propertyValue: PropTypes.any,

        /**
         * Controls how complex objects should be rendered.
         * "table" to render the value as an embedded PropertyGrid.
         * "json" to render the value as JSON.
         * "tostring" to render the value as whatever its toString method returns.
         */
        showObjectsAs: PropTypes.string.isRequired,

        /**
         * True to display the source code of function properties.
         */
        showFunctionDefinitions: PropTypes.bool.isRequired,
    }

    /**
     * @returns {string} JSX representing the component.
     */
    render = () => {
        const displayValue = buildPropertyDisplayValue(
            this.props.propertyValue, 
            this.props.showObjectsAs,
            this.props.showFunctionDefinitions);

        const jsx = (
            <td>{displayValue}</td>
        );

        return jsx;
    }
}

/**
 * @param {any} propertyValue Value of the property.
 * @param {string} showObjectsAs "table" to show object properties as an embedded table, "json"
 * to show them as JSON, or an empty string to use the object's toString method.
 * @param {boolean} showFunctionDefinitions True to show the source code of function properties.
 * @returns {string} JSX representing the value of the property.
 */
const buildPropertyDisplayValue = (propertyValue, showObjectsAs, showFunctionDefinitions) => {
    const propertyValueType = typeof propertyValue;
    let propertyDisplayValue;
    switch (propertyValueType) {
        case 'string':
            propertyDisplayValue = propertyValue;
            break;

        case 'number':
        case 'boolean':
        case 'symbol':
            propertyDisplayValue = propertyValue.toString();
            break;

        case 'object':
            if (propertyValue == null) {
                propertyDisplayValue = '[null]';
            } else {
                propertyDisplayValue = buildObjectRepresentation(propertyValue, showObjectsAs);
            }
            break;
        
        case 'function':
            if (showFunctionDefinitions) {
                propertyDisplayValue = propertyValue.toString();
            } else {
                propertyDisplayValue = '[function]';
            }
            break;
        
        case 'undefined':
            propertyDisplayValue = '[undefined]';
            break;

        /* istanbul ignore next */
        default: {
            const msg = `We couldn't work out how to display this property because it has `
                + `an unrecognised type: "${propertyValueType}"`;
            propertyDisplayValue = (
                <div className="alert alert-warning">{msg}</div>
            );
            break;
        }
    }

    return propertyDisplayValue;
};

/**
 * @param {any} propertyValue The value of the property.
 * @param {string} showObjectsAs "table" to show objects as an embedded table. "json" to show them
 * as JSON, or "tostring" to use the object's toString method.
 * @returns {string} JSX representing either a table, JSON string or other string representation of
 * the property's value.
 */
const buildObjectRepresentation = (propertyValue, showObjectsAs) => {
    let propertyDisplayValue;
    switch (showObjectsAs) {
        case 'table':
            propertyDisplayValue = (
                <PropertyGrid 
                    value={propertyValue} 
                    showObjectsAs={showObjectsAs} 
                    title=''
                />
            );
            break;
        
        case 'json':
            propertyDisplayValue = (
                <pre className="text-left" style={{whiteSpace: "pre-wrap"}}>
                    {JsonBeautify(propertyValue, null, 2, 20)}
                </pre>
            );
            break;

        default:
            propertyDisplayValue = propertyValue.toString();
            break;
    }

    return propertyDisplayValue;
};
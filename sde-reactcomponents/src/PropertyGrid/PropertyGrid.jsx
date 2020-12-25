import React from 'react';
import PropTypes from 'prop-types';
import {QuestionIcon} from '@primer/octicons-react';

import Controls from './Controls';
import Header from './Header';
import PropertyRow from './Row';

/** Visualises an object as a table of name-value pairs. */
export default class PropertyGrid extends React.Component {
    /**
     * Initializes a new instance of the PropertyGrid class.
     * @param {object} props Values passed into this component as JSX attributes.
     */
    constructor(props) {
        super(props);
        this.state = {
            value: props.value,
            title: props.title,
            showObjectsAs: props.showObjectsAs,
            showFunctionDefinitions: props.showFunctionDefinitions ? true : false,
        };
    }

    static propTypes = {
        /** The object to represent */
        value: PropTypes.object.isRequired,

        /** Title for the PropertyGrid */
        title: PropTypes.string.isRequired,

        /**
         * Controls how properties of type object are represented.
         * Valid values are 
         *  "table": (embed another PropertyGrid),
         *  "json": (JSON.stringify the value)
         *  "tostring": (call its toString method)
         */
        showObjectsAs: PropTypes.string.isRequired,

        /** 
         * True to show the source code of any function properties.
         * Falsy to show the value of function properties as "[function]"
         */
        showFunctionDefinitions: PropTypes.bool,
    }

    /**
     * Called by the React runtime when the component's state changes
     * @returns {string} JSX describing how to render the component.
     */
    render = () => {
        const rows = [];
        const propertyNames = Reflect.ownKeys(this.state.value);
        if (propertyNames.length === 0) {
            // It's an object with no properties, so let's hope its toString method
            // returns something useful.
            const info = (this.state.showObjectsAs === 'toString') ? (
                <div>{this.props.value.toString()}</div>
            ) : (
                <div 
                >
                    {this.props.value.toString()}
                    &nbsp;
                    <span
                        data-toggle="tooltip" 
                        title="This object does not have any properties so we're falling back on its toString method"
                    >
                        <QuestionIcon size={20} className="float-right" />
                    </span>
                </div>
            );
            return info;
        }

        let hasObjectProperties = false;
        let hasFunctionProperties = false;
        for (let propertyName of propertyNames) {
            const propertyValue = this.props.value[propertyName];
            const row = (
                <PropertyRow 
                    key={propertyName} 
                    propertyName={propertyName} 
                    propertyValue={propertyValue} 
                    showObjectsAs={this.state.showObjectsAs} 
                    showFunctionDefinitions={this.state.showFunctionDefinitions} 
                />
            );
            rows.push(row);
            if (typeof propertyValue === 'object' && propertyValue) {
                if (Reflect.ownKeys(propertyValue).length > 0) {
                    hasObjectProperties = true;
                }
            } else if (typeof propertyValue === 'function') {
                hasFunctionProperties = true;
            }
        }

        const table = (
            <table className="table table-sm table-hover table-bordered">
                <Header />
                <tbody>
                    {rows.concat()}
                </tbody>
            </table>
        );

        // No point showing the buttons controlling the display of object properties or
        // function properties if there aren't any.
        const showObjectsAs = hasObjectProperties ? this.state.showObjectsAs : 'none';
        const propertyGridControls = (
            <Controls 
                showObjectsAs={showObjectsAs} 
                setShowObjectsAs={(as) => this.setState({showObjectsAs: as})} 
                showFunctionDefinitions={this.state.showFunctionDefinitions}
                setShowFunctionDefinitions={(show) => this.setState({showFunctionDefinitions: show})}
                showFunctionDefinitionsButton={hasFunctionProperties}
            />
        );

        // Only give the card a header if there's something to put in it
        const cardHeader = (this.props.title.length > 0 || hasObjectProperties || hasFunctionProperties)
            ? 
            (
                <div className="card-header">
                    <h5 className="float-left">{this.props.title}</h5>
                    {propertyGridControls}
                </div>
            ) : '';

        const jsx = (
            <div className="card">
                {cardHeader}
                <div className="card-body">{table}</div>
            </div>
        );

        return jsx;
    }
}

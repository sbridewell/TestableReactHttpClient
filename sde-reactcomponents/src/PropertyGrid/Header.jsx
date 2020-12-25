import React from 'react';

/** Table header row for a PropertyGrid */
export default class PropertyGridHeader extends React.Component {
    /**
     * @returns {string} JSX describing how to render the component.
     */
    render = () => {
        return (
            <thead className="thead-dark">
                <tr key="propertygrid-header">
                    <th scope="col">Name</th>
                    <th scope="col">Value</th>
                    <th scope="col">Type</th>
                </tr>
            </thead>
        );
    }
}
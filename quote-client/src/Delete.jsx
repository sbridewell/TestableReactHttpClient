import PropTypes from 'prop-types';
import React from 'react';

import {
    ReactHttpClients,
} from 'sde-httpclient';
import {
    Button,
    NumericInput,
    PropertyGrid,
} from 'sde-reactcomponents';

import QuoteResponse from './QuoteResponse';
import QuoteClient from './QuoteClient';

/** React component which makes DELETE calls to a web API service */
export default class Delete extends React.Component {
    static propTypes = {
        /**
         * Set to true to render tables showing the component's props and state.
         */
        showPropsAndState: PropTypes.bool,

        /**
         * Set to true to write information about web API service calls to the console.
         */
        httpLogging: PropTypes.bool,

        /** "fetch" or "axios" */
        httpRequestMechanism: PropTypes.string.isRequired,
    }

    /**
     * Initializes a new instance of the SimpleGet component.
     * @param {object} props Values passed to the component as JSX attributes.
     */
    constructor(props) {
        super(props);
        this.state = {
            quoteId: 1,
            searchString: '',
        };
    }

    /**
     * Called by the React runtime immediately after the component is inserted into the DOM.
     */
    componentDidMount = () => {
        ReactHttpClients.register(this, QuoteClient);
    }

    /**
     * Called by the React runtime immediately after the component is updated, but 
     * not for the initial render.
     * @param {object} prevProps The component's props before the update occured.
     */
    componentDidUpdate = (prevProps) => {
        // If the HTTP request mechanism has changed, re-register the clients.
        // This allows the user to change the HTTP request mechanism without reloading
        // the page.
        if (this.props.httpRequestMechanism !== prevProps.httpRequestMechanism
            || this.props.httpLogging !== prevProps.httpLogging) {
            ReactHttpClients.register(this, QuoteClient);
        }
    }

    /**
     * Called by the React runtime when the component's state changes.
     * @returns {string} JSX to render the component.
     */
    render = () => {
        const state = this.state;
        const client = state.quoteClient;

        // render is called for the first time before componentDidMount is called, so don't
        // render anything if componentDidMount hasn't registered the client yet.
        if (!client) return '';

        const deleteQuote = () => {
            client.delete({id: state.quoteId});
        };

        const handleIdChanged = (quoteId) => this.setState({quoteId: parseInt(quoteId)});

        const description = (<div>Use this to delete a quote.</div>);

        const idGroup = (
            <div className="input-group">
                <div className="import-group-prepend">
                    <label htmlFor="quoteid-input" className="input-group-text">
                        Enter quote ID
                    </label>
                </div>
                <NumericInput 
                    id="quoteid-input"
                    type="text" 
                    className="form-control" 
                    value={this.state.quoteId}
                    onChange={(e) => handleIdChanged(e.target.value)}
                />
                <div className="input-group-append">
                    <Button 
                        additionalClass="btn-success"
                        onClick={deleteQuote}
                        disabled={client.inProgress}
                    >
                        Delete quote
                    </Button>
                </div>
            </div>
        );

        const response = (
            <QuoteResponse client={client} />
        );

        const grids = this.props.showPropsAndState ? (
            <div>
                <PropertyGrid title="Props" value={this.props} showObjectsAs="json" />
                <PropertyGrid title="State" value={this.state} showObjectsAs="json" />
            </div>
        ) : '';

        const body = (
            <div>
                {description}
                {idGroup}
                {response}
                {grids}
            </div>
        );

        return body;
    }
}
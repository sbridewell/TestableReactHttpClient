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

/** React component which makes PUT calls to a web API service */
export default class Put extends React.Component {
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
     * Initializes a new instance of the SinpleGet component.
     * @param {object} props Values passed to the component as JSX attributes.
     */
    constructor(props) {
        super(props);
        this.state = {
            quoteId: 1,
            quote: '',
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
     * @returns {string} JSX describing how to render the component.
     */
    render = () => {
        const state = this.state;
        const client = state.quoteClient;

        // render is called for the first time before componentDidMount is called, so don't
        // render anything if componentDidMount hasn't registered the client yet.
        if (!client) return '';

        const putQuote = () => {
            client.put({id: state.quoteId}, {quote: state.quote});
        };

        const handleIdChanged = (quoteId) => this.setState({quoteId: parseInt(quoteId)});
        const handleQuoteChanged = (quote) => this.setState({quote: quote});

        const description = (
            <div>
                Use this to create a new quote if none exists with the supplied ID, or to 
                update an existing quote.
            </div>
        );

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
            </div>
        );

        const quoteGroup = (
            <div className="input-group">
                <div className="input-group-prepend">
                    <label htmlFor="quote-input" className="input-group-text">
                        Enter quote
                    </label>
                </div>
                <input 
                    id="quote-input"
                    type="text" 
                    className="form-control" 
                    onChange={(e) => handleQuoteChanged(e.target.value)}
                />
            </div>
        );

        const button = (
            <Button 
                onClick={putQuote}
                disabled={client.inProgress}
                additionalClass="btn btn-success"
            >
                Create or update quote
            </Button>
        );

        const form = (
            <div>
                {idGroup}
                {quoteGroup}
                {button}
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
                {form}
                {response}
                {grids}
            </div>
        );

        return body;
    }
}
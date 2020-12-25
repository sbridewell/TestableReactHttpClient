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

/**
 * React component which makes GET calls with query string parameters to a web API service.
 */
export default class Get extends React.Component {
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

        const getById = () => {
            client.get({id: state.quoteId});
        };
        const getBySearchString = () => {
            client.get({searchString: state.searchString});
        };
        const getByIdAndSearchString = () => {
            client.get({id: state.quoteId, searchString: state.searchString});
        };

        const handleIdChanged = (quoteId) => this.setState({quoteId: parseInt(quoteId)});
        const handleSearchStringChanged = (searchString) => {
            this.setState({searchString: searchString});
        };

        const description = (
            <div>Use this to search for a quote by ID or search string</div>
        );

        const idGroup = (
            <div className="input-group">
                <div className="input-group-prepend">
                    <label htmlFor="quoteid-input" className="input-group-text">
                        Enter quote ID
                    </label>
                </div>
                <NumericInput 
                    id="quoteid-input"
                    type="text" 
                    className="form-control" 
                    value={state.quoteId}
                    onChange={(e) => handleIdChanged(e.target.value)}
                />
                <div className="input-group-append">
                    <Button 
                        onClick={getById}
                        disabled={client.inProgress}
                        additionalClass="btn-success"
                    >
                        Get by ID
                    </Button>
                </div>
            </div>
        );

        const searchStringGroup = (
            <div className="input-group">
                <div className="input-group-prepend">
                    <label htmlFor="searchstring-input" className="input-group-text">
                        Enter search string
                    </label>
                </div>
                <input 
                    id="searchstring-input"
                    type="text" 
                    className="form-control" 
                    value={state.searchString}
                    onChange={(e) => handleSearchStringChanged(e.target.value)}
                />
                <div className="input-group-append">
                    <Button 
                        onClick={getBySearchString}
                        disabled={client.inProgress}
                        additionalClass="btn btn-success"
                    >
                        Get by search string
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
                {searchStringGroup}
                <button 
                    className="btn btn-success" 
                    onClick={getByIdAndSearchString}
                    disabled={client.inProgress}
                >
                    Get by ID and search string
                </button>
                {response}
                {grids}
            </div>
        );

        return body;
    }
}
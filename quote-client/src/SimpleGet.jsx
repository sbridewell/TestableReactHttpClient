import PropTypes from 'prop-types';
import React from 'react';

import {
    ReactHttpClients,
} from 'sde-httpclient';
import {
    Button,
    PropertyGrid,
} from 'sde-reactcomponents';

import appConfig from './appConfig';
import QuoteResponse from './QuoteResponse';
import QuoteClient from './QuoteClient';
import WebApiClientBase from './_imported/WebApiClientBase';

/**
 * React component for making simple (i.e. no query string) GET calls to a 
 * web API service.
 */
export default class SimpleGet extends React.Component {
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
        this.state = {};
    }

    /**
     * Called by the React runtime when the component has been mounted into the DOM.
     * This allows us to get some data from the web API service as soon as the page loads
     * without the user doing anything.
     */
    componentDidMount = () => {
        ReactHttpClients.register(this, QuoteClient);
        ReactHttpClients.register(this, NotAControllerClient);
        ReactHttpClients.register(this, NotListeningClient);
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
            ReactHttpClients.register(this, NotAControllerClient);
            ReactHttpClients.register(this, NotListeningClient);
        }
    }

    /**
     * Called by the React runtime when the component's state changes.
     * @returns {string} JSX describing how to render the component.
     */
    render = () => {
        const quoteClient = this.state.quoteClient;
        const notAControllerClient = this.state.notAControllerClient;
        const notListeningClient = this.state.notListeningClient;
        if (!quoteClient || !notAControllerClient || !notListeningClient) return '';
        const disableButtons = 
            quoteClient.inProgress 
            || notAControllerClient.inProgress 
            || notListeningClient.inProgress;

        // Makes a call to the quote service which should succeed.
        const successGroup = (
            <div>
                <Button
                    onClick={() => quoteClient.get({id: 1})}
                    disabled={disableButtons}
                    additionalClass="btn-success"
                >
                    Make success call
                </Button>
                <QuoteResponse client={quoteClient ?? {}} />
            </div>
        );

        // Makes a call which should result in a 404 response.
        // The server is there but we're asking for a resource which doesn't exist
        const failureGroup = (
            <div>
                <Button 
                    onClick={() => notAControllerClient.get()}
                    disabled={disableButtons}
                    additionalClass="btn-warning"
                >
                    Make failure call
                </Button>
                <QuoteResponse client={notAControllerClient ?? {}} />
            </div>
        );

        // Makes a call which should result in a network error.
        // Attempting to call a server/port number which isn't listening.
        const networkErrorGroup = (
            <div>
                <Button 
                    onClick={() => notListeningClient.get()}
                    disabled={disableButtons}
                    additionalClass="btn-danger"
                >
                    Make network error call
                </Button>
                <QuoteResponse client={notListeningClient ?? {}} />
            </div>
        );

        const grids = this.props.showPropsAndState ? (
            <div>
                <PropertyGrid title="Props" value={this.props} showObjectsAs="json" />
                <PropertyGrid title="State" value={this.state} showObjectsAs="json" />
            </div>
        ) : '';

        const body = (
            <div>
                {successGroup}
                {failureGroup}
                {networkErrorGroup}
                {grids}
            </div>
        );

        return body;
    }
}

/**
 * We wouldn't do this in a production environment.
 * This is just so that we can see what happens when the web API service returns a
 * non-success HTTP status, in this case a 404 not found.
 */
class NotAControllerClient extends WebApiClientBase {
    /**
     * Initializes a new instance of the NotAControllerClient class.
     * @param {object} callbacks WebApiCallbacks instance which encapsulates the callbacks
     * to be called when the web API service call starts, succeeds and fails.
     * @param {string} httpRequestMechanism Valid values are: "fetch", "axios".
     * @param {boolean} httpLogging True to log HTTP activity to the console.
     */
    constructor(callbacks, httpRequestMechanism, httpLogging) {
        super(appConfig.notAControllerUrl, callbacks, httpRequestMechanism, httpLogging);
    }
}

/**
 * We wouldn't do this in a production environment.
 * This is just so that we can see what happens when the web API service isn't running.
 */
class NotListeningClient extends WebApiClientBase {
    /**
     * Initializes a new instance of the NotListeningClient class.
     * @param {object} callbacks WebApiCallbacks instance which encapsulates the callbacks
     * to be called when the web API service call starts, succeeds and fails.
     * @param {string} httpRequestMechanism Valid values are: "fetch", "axios".
     * @param {boolean} httpLogging True to log HTTP activity to the console.
     */
    constructor(callbacks, httpRequestMechanism, httpLogging) {
        super(appConfig.notListeningUrl, callbacks, httpRequestMechanism, httpLogging);
    }
}

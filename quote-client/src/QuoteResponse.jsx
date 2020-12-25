import PropTypes from 'prop-types';
import React from 'react';

/**
 * Presentation component to display the response from a call to the Quote web API 
 * service.
 */
export default class QuoteResponse extends React.Component {
    static propTypes = {
        /**
         * Encapsulates the webApiCallInProgress, webApiCallSucceeded and webApiError
         * properties, plus the view model returned by the web API service.
         */
        client: PropTypes.object.isRequired,
    }

    /**
     * Called by the React runtime when the component's state changes.
     * @returns {string} JSX describing how to render the component.
     */
    render = () => {
        const client = this.props.client;
        let response;
        if (client.inProgress) {
            response = (
                <div>
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            );
        } else if (client.error) {
            response = (
                <div className="alert alert-warning">
                    <div>The web API service call errored and we didn&apos;t get a response :-(</div>
                    <div>
                        {client.error}
                    </div>
                </div>
            );
        } else if (client.succeeded) {
            response = (
                <div className="alert alert-success">
                    <div>Success!</div>
                    <div>
                        Quote ID: {client.response.body.quoteId}
                    </div>
                    <div>
                        Quote: {client.response.body.quote}
                    </div>
                </div>
            );
        } else if (client.failed) {
            response = (
                <div className="alert alert-warning">
                    <div>We got a failure response from the server :-(</div>
                    <div>
                        HTTP status: {client.response.status}
                    </div>
                    <div>
                        HTTP status text: {client.response.statusText}
                    </div>
                    <div>
                        HTTP status description: {client.response.statusDescription}
                    </div>
                    <div>
                        HTTP status category: {client.response.statusCategory}
                    </div>
                </div>
            );
        } else {
            response = '';
        }

        return response;
    }
}
import React from 'react';
import {render} from '@testing-library/react';
/*
In a non-React project we'd add the preset targets: {esmodules: true} to Babel config, but 
create-react-app doesn't put a Babel config file in the project, so we need to import this
apparently unused module instead.
*/
/* eslint-disable no-unused-vars */
import regeneratorRuntime from 'regenerator-runtime';
/* eslint-enable no-unused-vars */

import {
    WebApiCallbacks,
} from 'sde-httpclient';

import QuoteResponse from '../QuoteResponse';
import WebApiClientBase from '../_imported/WebApiClientBase';

describe('The QuoteResponse component', () => {
    describe('when the web API call is in progress', () => {
        it('displays a "Loading..." message', () => {
            const callbacks = new WebApiCallbacks(() => {}, () => {}, () => {});
            const client = new WebApiClientBase('http://url', callbacks, 'fetch');
            client.inProgress = true;
            const jsx = (
                <QuoteResponse client={client} />
            );
            const component = render(jsx);
            component.getByText("Loading...");
        });
    });

    describe('when the web API call is successful', () => {
        it('displays the details of the quote', () => {
            const callbacks = new WebApiCallbacks(() => {}, () => {}, () => {});
            const client = new WebApiClientBase('http://url', callbacks, 'fetch');
            const response = {
                headers: {},
                status: 200,
                body: {
                    quoteId: 654321,
                    quote: 'There is no try, only do',
                }
            };
            client.succeeded = true;
            client.response = response;
            const jsx = (
                <QuoteResponse client={client} />
            );
            const component = render(jsx);
            component.getByText(response.body.quoteId.toString(), {exact: false});
            component.getByText(response.body.quote, {exact: false});
        });
    });

    describe('when the web API call failed', () => {
        it('displays the details of the failure', () => {
            const callbacks = new WebApiCallbacks(() => {}, () => {}, () => {});
            const client = new WebApiClientBase('http://url', callbacks, 'fetch');
            const response = {
                headers: {},
                status: 400,
                body: {}
            };
            client.failed = true;
            client.response = response;
            const jsx = (
                <QuoteResponse client={client} />
            );
            const component = render(jsx);
            component.getByText("We got a failure response from the server", {exact: false});
            component.getByText(response.status.toString(), {exact: false});
        });
    });

    describe('when the web API call errored', () => {
        it('displays the error message', () => {
            const callbacks = new WebApiCallbacks(() => {}, () => {}, () => {});
            const client = new WebApiClientBase('http://url', callbacks, 'fetch');
            const error = 'it went bang';
            client.error = error;
            const jsx = (
                <QuoteResponse client={client} />
            );
            const component = render(jsx);
            component.getByText(error, {exact: false});
        });
    });
});

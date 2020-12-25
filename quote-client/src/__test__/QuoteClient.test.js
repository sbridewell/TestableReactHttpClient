import {WebApiCallbacks} from 'sde-httpclient';

/*
In a non-React project we'd add the preset targets: {esmodules: true} to Babel config, but 
create-react-app doesn't put a Babel config file in the project, so we need to import this
apparently unused module instead.
*/
/* eslint-disable no-unused-vars */
import regeneratorRuntime from 'regenerator-runtime';
/* eslint-enable no-unused-vars */

import appConfig from '../appConfig';
import QuoteClient from '../QuoteClient';

const url = appConfig.quoteControllerUrl;
const callbacks = new WebApiCallbacks(() => {}, () => {}, () => {});
const mechanism = 'fetch';

describe('The QuoteClient class', () => {
    describe('constructor', () => {
        it('instantiates the correct client property', () => {
            // Arrange / Act
            const client = new QuoteClient(callbacks, mechanism, true);

            // Assert
            expect(client.client).toBeDefined();
            expect(client.client.constructor.name).toBe('FetchClient');
        });

        it('sets the URL property', () => {
            // Arrange / Act
            const client = new QuoteClient(callbacks, mechanism, true);

            // Assert
            expect(client.client).toBeDefined();
            expect(client.client.url).toBe(url);
        });

        it('sets the callbacks property', () => {
            // Arrange / Act
            const client = new QuoteClient(callbacks, mechanism, true);

            // Assert
            expect(client.client).toBeDefined();
            expect(client.client.callbacks).toBe(callbacks);
        });

        it('when httpLogging is true, instantiates a logger', () => {
            // Arrange / Act
            const client = new QuoteClient(callbacks, mechanism, true);

            // Assert
            expect(client.client).toBeDefined();
            expect(client.client.logger).toBeDefined();
            expect(client.client.logger.constructor.name).toBe('HttpLogger');
        });

        it('when httpLogging is false, does not instantiate a logger', () => {
            // Arrange / Act
            const client = new QuoteClient(callbacks, mechanism, false);

            // Assert
            expect(client.client).toBeDefined();
            expect(client.client.logger).not.toBeDefined();
        });
    });
});
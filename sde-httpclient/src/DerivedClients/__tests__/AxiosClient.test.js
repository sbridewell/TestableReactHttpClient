import Axios from 'axios';

import AxiosClient from "../AxiosClient";
import DerivedClientTester from './DerivedClientTester.test.js';
import HttpLogger from '../../Utility/HttpLogger';

/**
 * This file tests the AxiosClient class using a manual mock of the Axios function.
 */

// We're using a mock HttpLogger for this test
jest.mock('../../Utility/HttpLogger');

// Because axios is an imported package, we need to pass it to jest.mock in order to mock
// some of its behaviour.
jest.mock('axios');

const realAxios = global.axios;

/**
 * Replaces the real implementation of axios with a mock implementation.
 * Based on https://stackoverflow.com/a/49653218
 * @param {number} status HTTP status to return.
 * @param {object} responseBody The body of a success response.
 * @param {boolean} networkError True to throw a network error, as if the web server can't
 * be reached or the web API service isn't running.
 * @param {boolean} otherError True to throw some error other than a NetworkError.
 */
const mockAxios = (
    status,
    responseBody,
    networkError,
    otherError
) => {
    if (networkError) {
        Axios.mockRejectedValue(Error('NetworkError'));
    } else if (otherError) {
        Axios.mockRejectedValue(Error('Something went wrong'));
    } else if (status < 400) {
        // Axios only resolves the promise if a success HTTP status is received
        Axios.mockResolvedValue({
            headers: {},
            ok: true,
            status: status,
            statusText: 'Dummpy HTTP status text',
            data: responseBody,
            config: {url: ''},
        });
    } else {
        // Axios rejects the promise if a non-success HTTP status is received
        Axios.mockRejectedValue({
            response: {
                headers: {},
                ok: false,
                status: status,
                statusText: 'Dummy HTTP status text',
                data: responseBody,
                config: {url: ''},
            }
        });
    }
};

/**
 * Restores the real implementation of axios.
 */
const unmockAxios = () => {
    global.axios = realAxios;
};

/** Called before each test is run */
beforeEach(() => {
    DerivedClientTester.reset();
    HttpLogger.resetMock();
});

/** Called after each test is run */
afterEach(() => {
    unmockAxios();
});

describe('The AxiosClient class', () => {
    const clientConstructor = new AxiosClient().constructor;
    const tester = new DerivedClientTester(clientConstructor, mockAxios);
    tester.runTheTests();
});

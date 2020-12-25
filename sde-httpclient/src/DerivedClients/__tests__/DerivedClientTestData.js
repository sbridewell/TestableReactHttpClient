// Exclude this file from code coverage because it only contains test data
/* istanbul ignore file */

it('contains some tests', () => {});

/**
 * Test data for testing AxiosClient, FetchClient or other implementation-specific client classes
 * which may be implemented later.
 */
export default {
    // A URL which the test can pass to the component being tested
    baseUrl: 'http://anyhost:12345/api',

    // Some parameters which the test can pass in the URL
    parameters: {
        foo: 'bar',
        moreFoo: 'moreBar',
    },

    // The query string which is expected to result from the above parameters
    expectedQueryString: '?foo=bar&moreFoo=moreBar',

    // Some data to put in the body of a request
    body: {
        stuff: {
            thing1: 1,
            thing2: 'two',
        },
        moreStuff: {
            a: 'A',
            b: 'b',
        },
    },
};
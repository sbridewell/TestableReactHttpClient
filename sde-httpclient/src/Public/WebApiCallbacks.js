/**
 * Class which encapsulates the 3 callbacks required to make web API calls.
 */
export default class WebApiCallbacks {
    /**
     * Initializes a new instance of the WebApiCallbacks class.
     * @param {Function} started Callback function for when the web API call starts.
     * @param {Function} completed Callback function for when the API call completes.
     * This could be a success or failure response.
     * This function should accept the response returned from the web API.
     * @param {Function} errored Callback function for when the web API call errors,
     * i.e. no response was received from the server.
     */
    constructor(started, /*succeeded, failed*/ completed, errored) {
        validateCallback(started, 'started');
        validateCallback(completed, 'completed');
        validateCallback(errored, 'errored');
        this.started = started;
        this.completed = completed;
        this.errored = errored;
        Object.preventExtensions(this);
    }
}

/**
 * Validates that the supplied function is defined and is of type Function.
 * @param  {Function} callback The function to validate.
 * @param  {string}  callbackName The name of the function parameter.
 */
const validateCallback = function(callback, callbackName) {
    if (!callback) {
        throw Error(`Callback function ${callbackName} is required`);
    }

    const callbackType = typeof callback;
    const expectedType = 'function';
    if (callbackType !== expectedType) {
        throw Error(`Callback function ${callbackName} should be of type `
            + `${expectedType} but is of type ${callbackType}`);
    }
};

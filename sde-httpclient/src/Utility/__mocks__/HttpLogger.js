/**
 * Mock implementation of the HttpLogger class.
 * Messages passed to the log method aren't logged to the console, instead
 * they are added to the end of the static logs property, which is an array.
 */
export default class HttpLoggerMock {
    static instances = [];

    /**
     * Initializes a new instance of the HttpLogger mock.
     */
    constructor() {
        this.logs = [];
        HttpLoggerMock.instances.push(this);
    }

    /**
     * Adds the supplied parameters to the logs property.
     * @param {object} params Parameters to log.
     */
    log = (...params) => {
        // console.warn(params)
        this.logs.push(params);
    }

    /**
     * @returns {HttpLoggerMock} The most recently created mock HttpLogger instance.
     */
    static getMostRecentInstance = () => {
        if (this.instances.length === 0) {
            const msg = 'No mock HttpLogger instances have been created yet.';
            throw Error(msg);
        }

        return this.instances[this.instances.length -1];
    }

    /**
     * @returns {object} The most recently logged message.
     */
    getMostRecentLog = () => {
        if (this.logs.length === 0) {
            const msg = 'No messages have been logged yet.';
            throw Error(msg);
        }

        return this.logs[this.logs.length - 1];
    }

    static resetMock = () => {
        this.instances = [];
    }
}

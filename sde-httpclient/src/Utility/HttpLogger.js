/**
 * Allows classes involved in making HTTP requests to log messages in a controllable way.
 */
export default class HttpLogger {
    /**
     * Logs the supplied parameter(s) to the console.
     * At the moment the HttpLogger class doesn't seem to give anything over and above the console
     * object, however putting the call to console.log here saves us having to disable and enable
     * eslint's no-console rule all over the place.
     * It also gives us the opportunity in the future to add common logging functionality later,
     * such as adding date and timestamps to the logs.
     * @param {any} params The values to log.
     */
    log = (...params) => {
        /* eslint-disable no-console */
        console.log(...params);
        /* eslint-enable no-console */
    }
}

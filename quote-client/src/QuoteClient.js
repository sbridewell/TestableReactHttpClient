import appConfig from "./appConfig";
// Need to import WebApiClientBase from this path rather than from the containing package in order
// to be able to mock it.
import WebApiClientBase from './_imported/WebApiClientBase';

/**
 * Handles interaction with the QuoteController.
 */
export default class QuoteClient extends WebApiClientBase {
    /**
     * Initializes a new instance of the QuoteClient class.
     * @param {object} callbacks WebApiCallbacks instance which encapsulates the callbacks
     * to be called when the web API service call starts, succeeds, fails or errors.
     * @param {string} httpRequestMechanism Valid values are: "fetch", "axios".
     * @param {boolean} httpLogging True to log HTTP activity to the console.
     */
    constructor(callbacks, httpRequestMechanism, httpLogging) {
        super(appConfig.quoteControllerUrl, callbacks, httpRequestMechanism, httpLogging);
    }
}
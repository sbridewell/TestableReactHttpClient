/* istanbul ignore file */
// Import the HttpLogger class from its package
import {HttpLogger} from 'sde-httpclient';

// And re-export it from here so that we can tell jest to mock this file.
// All consumers of HttpLogger in the current package should import it from 
// here rather than from sde-httpclient.
export default HttpLogger;
/* istanbul ignore file */
// Import the WebApiClientBase class from its package
import {WebApiClientBase} from 'sde-httpclient';

// And re-export it from here so that we can tell jest to mock this file.
// All consumers of WebApiClientBase in the current package should import it from 
// here rather than from sde-httpclient.
export default WebApiClientBase;
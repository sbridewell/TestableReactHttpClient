// Import the mock class from the sde-httlclient-mocks package.
import {HttpLoggerMock} from 'sde-httpclient';

// And re-export it from here.
// This file needs to be in a __mocks__ subfolder of the one where the
// actual implementation is imported and re-exported, otherwise Jest
// can't find this mock.
export default HttpLoggerMock;

/**
 * Note that at this stage the mock is still called HttpLoggerMock.
 * This is OK, because the name which is used in the consuming code
 * is set on the import statement in the file where it's used, and 
 * there it's imported as HttpLogger, not as HttpLoggerMock.
 */
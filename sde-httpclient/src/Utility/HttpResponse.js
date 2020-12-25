/**
 * A standard shape for HTTP responses.
 */
export default class HttpResponse {
    /**
     * Initializes a new instance of the HttpResponse class.
     * @param {number} status The numeric HTTP status code.
     * @param {object} headers The response headers.
     * @param {object} body The response body.
     * @param {string} url The URL in the response.
     */
    constructor(status, headers, body, url) {
        this.status = status;
        this.headers = headers;
        this.body = body;
        this.url = url;
        interpretStatus(this);
    }
}

/**
 * Enriches the HttpStatus object with information about its HTTP status code.
 * @param {object} response The HttpResponse object to enrich.
 */
function interpretStatus(response) {
    const range = Math.floor(response.status / 100);
    switch (range) {
        case 1:
            response.statusCategory = 'Informational';
            break;
        
        case 2:
            response.statusCategory = 'Success';
            break;

        case 3:
            response.statusCategory = 'Redirection';
            break;

        case 4:
            response.statusCategory = 'Client error';
            break;

        case 5:
            response.statusCategory = 'Server error';
            break;

        default:
            response.statusCategory = 'The server returned an invalid HTTP status code';
            break;
    }

    const statusDetail = statusArray.find((status) => {return (status.status == response.status);});
    if (statusDetail) {
        response.statusText = statusDetail.statusText;
        response.statusDescription = statusDetail.statusDescription;
    } else {
        response.statusText = 'Unrecognised HTTP status';
        response.statusDescription = 'The HTTP status in the response from the server was not recognised';
    }
}

/**
 * HTTP status information taken from https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
 */
const statusArray = [
    {status: 100, statusText: 'Continue', statusDescription: 'The server has received the request headers and the client should proceed to send the request body (in the case of a request for which a body needs to be sent; for example, a POST request). Sending a large request body to a server after a request has been rejected for inappropriate headers would be inefficient. To have a server check the request\'s headers, a client must send Expect: 100-continue as a header in its initial request and receive a 100 Continue status code in response before sending the body. If the client receives an error code such as 403 (Forbidden) or 405 (Method Not Allowed) then it shouldn\'t send the request\'s body. The response 417 Expectation Failed indicates that the request should be repeated without the Expect header as it indicates that the server doesn\'t support expectations (this is the case, for example, of HTTP/1.0 servers).'},
    {status: 101, statusText: 'Switching protocols', statusDescription: 'The requester has asked the server to switch protocols and the server has agreed to do so.'},
    {status: 102, statusText: 'Processing', statusDescription: 'A WebDAV request may contain many sub-requests involving file operations, requiring a long time to complete the request. This code indicates that the server has received and is processing the request, but no response is available yet. This prevents the client from timing out and assuming the request was lost.'},
    {status: 103, statusText: 'Early hints', statusDescription: 'Used to return some response headers before final HTTP message.'},
    {status: 200, statusText: 'OK', statusDescription: 'Standard response for successful HTTP requests. The actual response will depend on the request method used. In a GET request, the response will contain an entity corresponding to the requested resource. In a POST request, the response will contain an entity describing or containing the result of the action.'},
    {status: 201, statusText: 'Created', statusDescription: 'The request has been fulfilled, resulting in the creation of a new resource.'},
    {status: 202, statusText: 'Accepted', statusDescription: 'The request has been accepted for processing, but the processing has not been completed. The request might or might not be eventually acted upon, and may be disallowed when processing occurs.'},
    {status: 203, statusText: 'Non-authoritative information', statusDescription: 'The server is a transforming proxy (e.g. a Web accelerator) that received a 200 OK from its origin, but is returning a modified version of the origin\'s response.'},
    {status: 204, statusText: 'No content', statusDescription: 'The server successfully processed the request, and is not returning any content.'},
    {status: 205, statusText: 'Reset content', statusDescription: 'The server successfully processed the request, asks that the requester reset its document view, and is not returning any content.'},
    {status: 206, statusText: 'Partial content', statusDescription: 'The server is delivering only part of the resource (byte serving) due to a range header sent by the client. The range header is used by HTTP clients to enable resuming of interrupted downloads, or split a download into multiple simultaneous streams.'},
    {status: 207, statusText: 'Multi-status', statusDescription: 'The message body that follows is by default an XML message and can contain a number of separate response codes, depending on how many sub-requests were made.'},
    {status: 208, statusText: 'Already reported', statusDescription: 'The members of a DAV binding have already been enumerated in a preceding part of the (multistatus) response, and are not being included again.'},
    {status: 226, statusText: 'IM used', statusDescription: 'The server has fulfilled a request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance.'},
    {status: 300, statusText: 'Multiple choices', statusDescription: 'Indicates multiple options for the resource from which the client may choose (via agent-driven content negotiation). For example, this code could be used to present multiple video format options, to list files with different filename extensions, or to suggest word-sense disambiguation.'},
    {status: 301, statusText: 'Moved permanently', statusDescription: 'This and all future requests should be directed to the given URI.'},
    {status: 302, statusText: 'Found', statusDescription: 'Tells the client to look at (browse to) another URL. 302 has been superseded by 303 and 307. This is an example of industry practice contradicting the standard. The HTTP/1.0 specification (RFC 1945) required the client to perform a temporary redirect (the original describing phrase was "Moved Temporarily"),[21] but popular browsers implemented 302 with the functionality of a 303 See Other. Therefore, HTTP/1.1 added status codes 303 and 307 to distinguish between the two behaviours.[22] However, some Web applications and frameworks use the 302 status code as if it were the 303.'},
    {status: 303, statusText: 'See other', statusDescription: 'The response to the request can be found under another URI using the GET method. When received in response to a POST (or PUT/DELETE), the client should presume that the server has received the data and should issue a new GET request to the given URI.'},
    {status: 304, statusText: 'Not modified', statusDescription: 'Indicates that the resource has not been modified since the version specified by the request headers If-Modified-Since or If-None-Match. In such case, there is no need to retransmit the resource since the client still has a previously-downloaded copy.'},
    {status: 305, statusText: 'Use proxy', statusDescription: 'The requested resource is available only through a proxy, the address for which is provided in the response. For security reasons, many HTTP clients (such as Mozilla Firefox and Internet Explorer) do not obey this status code.'},
    {status: 306, statusText: 'Switch proxy', statusDescription: 'No longer used. Originally meant "Subsequent requests should use the specified proxy."'},
    {status: 307, statusText: 'Temporary redirect', statusDescription: 'In this case, the request should be repeated with another URI; however, future requests should still use the original URI. In contrast to how 302 was historically implemented, the request method is not allowed to be changed when reissuing the original request. For example, a POST request should be repeated using another POST request.'},
    {status: 308, statusText: 'Permanent redirect', statusDescription: 'The request and all future requests should be repeated using another URI. 307 and 308 parallel the behaviors of 302 and 301, but do not allow the HTTP method to change. So, for example, submitting a form to a permanently redirected resource may continue smoothly.'},
    {status: 400, statusText: 'Bad request', statusDescription: 'The server cannot or will not process the request due to an apparent client error (e.g., malformed request syntax, size too large, invalid request message framing, or deceptive request routing).'},
    {status: 401, statusText: 'Unauthorized', statusDescription: 'Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided. The response must include a WWW-Authenticate header field containing a challenge applicable to the requested resource. 401 semantically means "unauthorised", the user does not have valid authentication credentials for the target resource.'},
    {status: 402, statusText: 'Payment required', statusDescription: 'Reserved for future use.'},
    {status: 403, statusText: 'Forbidden', statusDescription: 'The request contained valid data and was understood by the server, but the server is refusing action. This may be due to the user not having the necessary permissions for a resource or needing an account of some sort, or attempting a prohibited action (e.g. creating a duplicate record where only one is allowed). This code is also typically used if the request provided authentication via the WWW-Authenticate header field, but the server did not accept that authentication. The request should not be repeated.'},
    {status: 404, statusText: 'Not found', statusDescription: 'The requested resource could not be found but may be available in the future. Subsequent requests by the client are permissible.'},
    {status: 405, statusText: 'Method not allowed', statusDescription: 'A request method is not supported for the requested resource; for example, a GET request on a form that requires data to be presented via POST, or a PUT request on a read-only resource.'},
    {status: 406, statusText: 'Not acceptable', statusDescription: 'The requested resource is capable of generating only content not acceptable according to the Accept headers sent in the request.'},
    {status: 407, statusText: 'Proxy authentication required', statusDescription: 'The client must first authenticate itself with the proxy.'},
    {status: 408, statusText: 'Request timeout', statusDescription: 'The server timed out waiting for the request. According to HTTP specifications: "The client did not produce a request within the time that the server was prepared to wait. The client MAY repeat the request without modifications at any later time."'},
    {status: 409, statusText: 'Conflict', statusDescription: 'Indicates that the request could not be processed because of conflict in the current state of the resource, such as an edit conflict between multiple simultaneous updates.'},
    {status: 410, statusText: 'Gone', statusDescription: 'Indicates that the resource requested is no longer available and will not be available again. This should be used when a resource has been intentionally removed and the resource should be purged. Upon receiving a 410 status code, the client should not request the resource in the future. Clients such as search engines should remove the resource from their indices.[42] Most use cases do not require clients and search engines to purge the resource, and a "404 Not Found" may be used instead.'},
    {status: 411, statusText: 'Length required', statusDescription: 'The request did not specify the length of its content, which is required by the requested resource.'},
    {status: 412, statusText: 'Precondition failed', statusDescription: 'The server does not meet one of the preconditions that the requester put on the request header fields.'},
    {status: 413, statusText: 'Payload too large', statusDescription: 'The request is larger than the server is willing or able to process. Previously called "Request Entity Too Large".'},
    {status: 414, statusText: 'URI too long', statusDescription: 'The URI provided was too long for the server to process. Often the result of too much data being encoded as a query-string of a GET request, in which case it should be converted to a POST request. Called "Request-URI Too Long" previously.'},
    {status: 415, statusText: 'Unsupported media type', statusDescription: 'The request entity has a media type which the server or resource does not support. For example, the client uploads an image as image/svg+xml, but the server requires that images use a different format.'},
    {status: 416, statusText: 'Range not satisfiable', statusDescription: 'The client has asked for a portion of the file (byte serving), but the server cannot supply that portion. For example, if the client asked for a part of the file that lies beyond the end of the file. Called "Requested Range Not Satisfiable" previously.'},
    {status: 417, statusText: 'Expectation failed', statusDescription: 'The server cannot meet the requirements of the Expect request-header field.'},
    {status: 418, statusText: 'I\'m a teapot', statusDescription: 'This code was defined in 1998 as one of the traditional IETF April Fools\' jokes, in RFC 2324, Hyper Text Coffee Pot Control Protocol, and is not expected to be implemented by actual HTTP servers. The RFC specifies this code should be returned by teapots requested to brew coffee. This HTTP status is used as an Easter egg in some websites, such as Google.com\'s I\'m a teapot easter egg.'},
    {status: 421, statusText: 'Misdirected request', statusDescription: 'The request was directed at a server that is not able to produce a response (for example because of connection reuse).'},
    {status: 422, statusText: 'Unprocessable entity', statusDescription: 'The request was well-formed but was unable to be followed due to semantic errors.'},
    {status: 423, statusText: 'Locked', statusDescription: 'The resource that is being accessed is locked.'},
    {status: 424, statusText: 'Failed dependency', statusDescription: 'The request failed because it depended on another request and that request failed (e.g., a PROPPATCH).'},
    {status: 425, statusText: 'Too early', statusDescription: 'Indicates that the server is unwilling to risk processing a request that might be replayed.'},
    {status: 426, statusText: 'Upgrade required', statusDescription: 'The client should switch to a different protocol such as TLS/1.0, given in the Upgrade header field.'},
    {status: 428, statusText: 'Precondition required', statusDescription: 'The origin server requires the request to be conditional. Intended to prevent the \'lost update\' problem, where a client GETs a resource\'s state, modifies it, and PUTs it back to the server, when meanwhile a third party has modified the state on the server, leading to a conflict.'},
    {status: 429, statusText: 'Too many requests', statusDescription: 'The user has sent too many requests in a given amount of time. Intended for use with rate-limiting schemes.'},
    {status: 431, statusText: 'Request header fields too large', statusDescription: 'The server is unwilling to process the request because either an individual header field, or all the header fields collectively, are too large.'},
    {status: 451, statusText: 'Unavailable for legal reasons', statusDescription: 'A server operator has received a legal demand to deny access to a resource or to a set of resources that includes the requested resource. The code 451 was chosen as a reference to the novel Fahrenheit 451.'},
    {status: 500, statusText: 'Internal server error', statusDescription: 'A generic error message, given when an unexpected condition was encountered and no more specific message is suitable.'},
    {status: 501, statusText: 'Not implemented', statusDescription: 'The server either does not recognize the request method, or it lacks the ability to fulfil the request. Usually this implies future availability (e.g., a new feature of a web-service API).'},
    {status: 502, statusText: 'Bad gateway', statusDescription: 'The server was acting as a gateway or proxy and received an invalid response from the upstream server.'},
    {status: 503, statusText: 'Service unavailable', statusDescription: 'The server cannot handle the request (because it is overloaded or down for maintenance). Generally, this is a temporary state.'},
    {status: 504, statusText: 'Gateway timeout', statusDescription: 'The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.'},
    {status: 505, statusText: 'HTTP version not supported', statusDescription: 'The server does not support the HTTP protocol version used in the request.'},
    {status: 506, statusText: 'Variant also negotiates', statusDescription: 'Transparent content negotiation for the request results in a circular reference.'},
    {status: 507, statusText: 'Insufficient storage', statusDescription: 'The server is unable to store the representation needed to complete the request.'},
    {status: 508, statusText: 'Loop detected', statusDescription: 'The server detected an infinite loop while processing the request (sent instead of 208 Already Reported).'},
    {status: 510, statusText: 'Not extended', statusDescription: 'Further extensions to the request are required for the server to fulfil it.'},
    {status: 511, statusText: 'Network authentication required', statusDescription: 'The client needs to authenticate to gain network access. Intended for use by intercepting proxies used to control access to the network (e.g., "captive portals" used to require agreement to Terms of Service before granting full Internet access via a Wi-Fi hotspot).'},
];
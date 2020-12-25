import HttpResponse from '../HttpResponse';

const headers = {
    header1: 1,
    header2: 'two',
};

const body = {
    foo: 'foo',
    bar: 'bar',
};

const url = 'http://somewhere';

describe('The HttpResponse class', () => {
    it('sets the header correctly', () => {
        // Act
        const status = new HttpResponse(200, headers, body, url);

        // Assert
        expect(status.headers).toStrictEqual(headers);
    });

    it('sets the body correctly', () => {
        // Act
        const status = new HttpResponse(200, headers, body, url);

        // Assert
        expect(status.body).toStrictEqual(body);
    });

    it('sets the url correctly', () => {
        // Act
        const status = new HttpResponse(200, headers, body, url);

        // Assert
        expect(status.url).toBe(url);
    });

    describe('sets the status information correctly', () => {
        it('for 1xx statuses', () => {
            // Act
            const status = new HttpResponse(100, headers, body, url);

            // Assert
            expect(status.status).toBe(100);
            expect(status.statusCategory).toBe('Informational');
            expect(status.statusText).toBe('Continue');
            expect(status.statusDescription).toBe('The server has received the request headers and the client should proceed to send the request body (in the case of a request for which a body needs to be sent; for example, a POST request). Sending a large request body to a server after a request has been rejected for inappropriate headers would be inefficient. To have a server check the request\'s headers, a client must send Expect: 100-continue as a header in its initial request and receive a 100 Continue status code in response before sending the body. If the client receives an error code such as 403 (Forbidden) or 405 (Method Not Allowed) then it shouldn\'t send the request\'s body. The response 417 Expectation Failed indicates that the request should be repeated without the Expect header as it indicates that the server doesn\'t support expectations (this is the case, for example, of HTTP/1.0 servers).');
        });

        it('for 2xx statuses', () => {
            // Act
            const status = new HttpResponse(201, headers, body, url);

            // Asset
            expect(status.status).toBe(201);
            expect(status.statusCategory).toBe('Success');
            expect(status.statusText).toBe('Created');
            expect(status.statusDescription).toBe('The request has been fulfilled, resulting in the creation of a new resource.');
        });

        it('for 3xx statuses', () => {
            // Act
            const status = new HttpResponse(307, headers, body, url);

            // Asset
            expect(status.status).toBe(307);
            expect(status.statusCategory).toBe('Redirection');
            expect(status.statusText).toBe('Temporary redirect');
            expect(status.statusDescription).toBe('In this case, the request should be repeated with another URI; however, future requests should still use the original URI. In contrast to how 302 was historically implemented, the request method is not allowed to be changed when reissuing the original request. For example, a POST request should be repeated using another POST request.');
        });

        it('for 4xx statuses', () => {
            // Act
            const status = new HttpResponse(401, headers, body, url);

            // Asset
            expect(status.status).toBe(401);
            expect(status.statusCategory).toBe('Client error');
            expect(status.statusText).toBe('Unauthorized');
            expect(status.statusDescription).toBe('Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided. The response must include a WWW-Authenticate header field containing a challenge applicable to the requested resource. 401 semantically means "unauthorised", the user does not have valid authentication credentials for the target resource.');
        });

        it('for 5xx statuses', () => {
            // Act
            const status = new HttpResponse(500, headers, body, url);

            // Asset
            expect(status.status).toBe(500);
            expect(status.statusCategory).toBe('Server error');
            expect(status.statusText).toBe('Internal server error');
            expect(status.statusDescription).toBe('A generic error message, given when an unexpected condition was encountered and no more specific message is suitable.');
        });

        it('for invalid statuses', () => {
            // Act
            const status = new HttpResponse(1, headers, body, url);

            // Asset
            expect(status.status).toBe(1);
            expect(status.statusCategory).toBe('The server returned an invalid HTTP status code');
            expect(status.statusText).toBe('Unrecognised HTTP status');
            expect(status.statusDescription).toBe('The HTTP status in the response from the server was not recognised');
        });
    });
});
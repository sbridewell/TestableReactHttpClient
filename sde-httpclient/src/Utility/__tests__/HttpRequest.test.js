import HttpRequest from '../HttpRequest';

describe('the HttpRequest class', () => {
    describe('constructor', () => {
        it('throws an error when the verb is invalid', () => {
            const verb = 'spam';
            const action = () => {
                new HttpRequest(verb);
            };
            const expectedMessage = `The "verb" parameter is not valid, it should be one of `
                + `"DELETE", "GET", "POST", "PUT", but was ${verb}.`;

            expect(action).toThrow(expectedMessage);
        });

        it('throws an error when the URL is not valid', () => {
            const verb = 'GET';
            const url = {};
            const action = () => {
                new HttpRequest(verb, url);
            };
            const expectedMessage = `The "url" parameter is not valid, it should be of type `
                + `"string", but is of type "object"`;

            expect(action).toThrow(expectedMessage);
        });

        it('throws an error when the headers are not valid', () => {
            const verb = 'GET';
            const url = 'http://server/controller';
            const headers = '';
            const action = () => {
                new HttpRequest(verb, url, headers);
            };
            const expectedMessage = `The "headers" parameter should be of type "object" `
                + `but is of type "string"`;

            expect(action).toThrow(expectedMessage);
        });

        it('sets the properties correctly', () => {
            const verb = 'GET';
            const url = 'http://server/controller';
            const headers = {
                foo: 'foo',
                bar: 'bar',
            };
            const body = {
                p1: 1,
                p2: 'two',
            };
            const request = new HttpRequest(verb, url, headers, body);

            expect(request.verb).toBe(verb);
            expect(request.url).toBe(url);
            expect(request.headers).toBe(headers);
            expect(request.body).toStrictEqual(body);
        });
    });
});
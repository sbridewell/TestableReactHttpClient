import WebApiCallbacks from '../WebApiCallbacks';

describe('The WebApiCallbacks class', () => {
    it('sets the properties correctly', () => {
        const started = () => {};
        const completed = () => {};
        const errored = () => {};
        const callbacks = new WebApiCallbacks(started, completed, errored);
        expect(callbacks.started).toBe(started);
        expect(callbacks.completed).toBe(completed);
        expect(callbacks.errored).toBe(errored);
    });

    it('Throws the correct error when no started callback is supplied', () => {
        const code = () => {
            new WebApiCallbacks(
                null,
                () => {return false;},
                () => {return false;},
            );
        };

        expect(code).toThrow('Callback function started is required');
    });

    it('throws the correct error when the started callback is not a function', () => {
        const code = () => {
            new WebApiCallbacks(
                'hello',
                () => {return false;},
                () => {return false;},
            );
        };

        expect(code).toThrow('Callback function started should be of type function but is of type string');
    });

    it('Throws the correct error when no completed callback is supplied', () => {
        const code = () => {
            new WebApiCallbacks(
                () => {return false;},
                null,
                () => {return false;},
            );
        };

        expect(code).toThrow('Callback function completed is required');
    });

    it('throws the correct error when the completed callback is not a function', () => {
        const code = () => {
            new WebApiCallbacks(
                () => {return false;},
                'hello',
                () => {return false;},
            );
        };

        expect(code).toThrow('Callback function completed should be of type function but is of type string');
    });

    it('Throws the correct error when no errored callback is supplied', () => {
        const code = () => {
            new WebApiCallbacks(
                () => {return false;},
                () => {return false;},
                null,
            );
        };

        expect(code).toThrow('Callback function errored is required');
    });

    it('throws the correct error when the errored callback is not a function', () => {
        const code = () => {
            new WebApiCallbacks(
                () => {return false;},
                () => {return false;},
                'hello',
            );
        };

        expect(code).toThrow('Callback function errored should be of type function but is of type string');
    });
});
import ReactHttpClients from '../ReactHttpClients';
import WebApiClientBase from '../WebApiClientBase';

jest.mock('../WebApiClientBase');

/** A WebApiClientBase implementation for use in this test. */
class FooClient extends WebApiClientBase {
    /** 
     * Initializes a new instance of the FooComponent class.
     * @param {object} callbacks WebApiCallbacks instance which encapsulates the callbacks
     * to be called when the web API service call starts, succeeds, fails or errors.
     * @param {string} httpRequestMechanism Valid values are: "fetch", "axios".
     * @param {boolean} httpLogging True to log HTTP activity to the console.
     */
    constructor(callbacks, httpRequestMechanism, httpLogging) {
        super('http://foo', callbacks, httpRequestMechanism, httpLogging);
    }
}

/** 
 * Base class for our FooComponent because this package doesn't include React.
 * This base class needs to be called Component in order to pass the validation
 * in ReactHttpComponents and mimics some of the behaviour of React.Component.
 */
class Component {
    /**
     * Initializes a new instance of the Component class.
     */
    constructor() {
        this.state = [];
        this.props = {
            httpRequestMechanism: 'fetch',
            httpLogging: false,
        };
    }

    /**
     * Adds the properties of the supplied object to the state property.
     * @param {object} partialState Object from which properties are to be added to state.
     */
    setState = (partialState) => {
        Object.assign(this.state, partialState);
    }
}

/** A component to be used in this test case */
class FooComponent extends Component {
    // /**
    //  * Initializes a new instance of the FooComponent class.
    //  * @param {object} props Values passed to the component as JSX attributes.
    //  */
    // constructor(props) {
    //     super(props);
    //     this.state = {};
    // }
    register = () => {
        ReactHttpClients.register(this, FooClient);
    }
}

let component;

beforeEach(() => {
    component = new FooComponent();
});

describe('The ReactHttpClients class', () => {
    describe('register method', () => {
        it('sets the component\'s state correctly', () => {
            component.register();
            const client = component.state.fooClient;
            expect(client).toBeDefined();
            expect(client).toBeInstanceOf(FooClient);
            expect(client.inProgress).toBeDefined();
            expect(client.inProgress).toBeFalsy();
            expect(client.succeeded).toBeDefined();
            expect(client.succeeded).toBeFalsy();
            expect(client.failed).toBeDefined();
            expect(client.failed).toBeFalsy();
            expect(client.error).toBe('');
            expect(client.response).toStrictEqual({});
        });

        it('errors if the component parameter is not derived from a Component class', () => {
            const action = () => ReactHttpClients.register({}, FooClient);
            expect(action).toThrow('The "component" parameter should be an instance of a');
        });
    });

    describe('when the call is in progress', () => {
        it('sets the component\'s state correctly', () => {
            component.register();
            const mockClient = FooClient.getMostRecentInstance();
            mockClient.mockStarted();
            const client = component.state.fooClient;
            expect(client).toBeDefined();
            expect(client).toBeInstanceOf(FooClient);
            expect(client.inProgress).toBeDefined();
            expect(client.inProgress).toBeTruthy();
            expect(client.succeeded).toBeDefined();
            expect(client.succeeded).toBeFalsy();
            expect(client.failed).toBeDefined();
            expect(client.failed).toBeFalsy();
            expect(client.error).toBe('');
            expect(client.response).toStrictEqual({});
        });
    });

    describe('when the call succeeds', () => {
        it('sets the component\'s state correctly', () => {
            component.register();
            const response = {
                status: 200,
                headers: {},
                body: {},
            };
            const mockClient = FooClient.getMostRecentInstance();
            mockClient.mockStarted();
            mockClient.mockCompleted(response);
            const client = component.state.fooClient;
            expect(client).toBeDefined();
            expect(client).toBeInstanceOf(FooClient);
            expect(client.inProgress).toBeDefined();
            expect(client.inProgress).toBeFalsy();
            expect(client.succeeded).toBeDefined();
            expect(client.succeeded).toBeTruthy();
            expect(client.failed).toBeDefined();
            expect(client.failed).toBeFalsy();
            expect(client.error).toBe('');
            expect(client.response).toBe(response);
        });
    });

    describe('when the call fails', () => {
        it('sets the component\'s state correctly', () => {
            component.register();
            const response = {status: 400};
            const mockClient = FooClient.getMostRecentInstance();
            mockClient.mockStarted();
            mockClient.mockCompleted(response);
            const client = component.state.fooClient;
            expect(client).toBeDefined();
            expect(client).toBeInstanceOf(FooClient);
            expect(client.inProgress).toBeDefined();
            expect(client.inProgress).toBeFalsy();
            expect(client.succeeded).toBeDefined();
            expect(client.succeeded).toBeFalsy();
            expect(client.failed).toBeDefined();
            expect(client.failed).toBeTruthy();
            expect(client.error).toBe('');
            expect(client.response).toBe(response);
        });
    });

    describe('when the call errors', () => {
        it('sets the component\'s state correctly', () => {
            component.register();
            const error = 'it didn\'t work';
            const mockClient = FooClient.getMostRecentInstance();
            mockClient.mockStarted();
            mockClient.mockErrored(error);
            const client = component.state.fooClient;
            expect(client).toBeDefined();
            expect(client).toBeInstanceOf(FooClient);
            expect(client.inProgress).toBeDefined();
            expect(client.inProgress).toBeFalsy();
            expect(client.succeeded).toBeDefined();
            expect(client.succeeded).toBeFalsy();
            expect(client.failed).toBeDefined();
            expect(client.failed).toBeFalsy();
            expect(client.error).toBe(error);
            expect(client.response).toStrictEqual({});
        });
    });
});

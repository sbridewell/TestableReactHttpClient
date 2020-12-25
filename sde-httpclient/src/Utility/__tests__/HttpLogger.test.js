import HttpLogger from '../HttpLogger';

// Holds any messages which the console.log mock has redirected away from the console.
let consoleMessages;

// Somewhere to hold the real console.log implementation whilst it's being mocked.
const realConsoleLog = global.console;

beforeEach(() => {
    mockConsole();
    consoleMessages = [];
});

afterEach(() => {
    unmockConsole();
});

describe('The HttpLogger class (using a manual mock of console.log)', () => {
    it('log method logs to the console', () => {
        // Arrange
        const logger = new HttpLogger();

        // Act
        logger.log('Message 1', {foo: 'bar'});
        logger.log('Message 2');

        // Assert
        // Note that the arguments passed to the log method are logged as an array,
        // even if there's only one argument.
        expect(consoleMessages).toHaveLength(2);
        expect(consoleMessages[0]).toStrictEqual(['Message 1', {foo: 'bar'}]);
        expect(consoleMessages[1]).toStrictEqual(['Message 2']);
    });
});

/**
 * Replaces the real implementation of console to write messages to the
 * consoleMessages array.
 */
const mockConsole = () => {
    global.console.log = jest.fn().mockImplementation((...params) => {
        consoleMessages.push(params);
    });
};

/**
 * Restores the real console implementation.
 */
const unmockConsole = () => {
    global.console.log = realConsoleLog;
};

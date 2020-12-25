import {
    WebApiCallbacks,
    WebApiClientBase,
    WebApiClientBaseMock,
} from './index';

const validateExport = (func, functionName) => {
    expect(func).toBeDefined();
    expect(typeof func).toBe('function');
    expect(func.name).toBe(functionName);
};

it('The sde-httpclient package', () => {
    validateExport(WebApiCallbacks, 'WebApiCallbacks');
    validateExport(WebApiClientBase, 'WebApiClientBase');
    validateExport(WebApiClientBaseMock, 'WebApiClientBaseMock');
});
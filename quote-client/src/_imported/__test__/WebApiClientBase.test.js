import WebApiClientBase from '../WebApiClientBase';

const validateExport = (func, functionName) => {
    expect(func).toBeDefined();
    expect(typeof func).toBe('function');
    expect(func.name).toBe(functionName);
};

it ('the imported WebApiClientBase class', () => {
    validateExport(WebApiClientBase, 'WebApiClientBase');
});
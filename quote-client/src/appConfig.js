const webApiProtocol = 'https';
const webApiHostname = 'localhost';
const webApiPortNumber = '44336';
const webApiRoot = 'api';
const notListeningPortNumber = '1';
const webApiAbsoluteRoot = `${webApiProtocol}://${webApiHostname}:${webApiPortNumber}/${webApiRoot}`;

const appConfig = {
    quoteControllerUrl: `${webApiAbsoluteRoot}/Quote`,
    notAControllerUrl: `${webApiAbsoluteRoot}/NotAController`,
    notListeningUrl: `${webApiProtocol}://${webApiHostname}:${notListeningPortNumber}`,

    // This controls how we perform HTTP requests to the web API service.
    httpRequestMechanism: 'fetch',
    // httpRequestMechanism: 'axios',
};

export default appConfig;
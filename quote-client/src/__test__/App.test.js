import React from 'react';
import { render } from '@testing-library/react';

/*
In a non-React project we'd add the preset targets: {esmodules: true} to Babel config, but 
create-react-app doesn't put a Babel config file in the project, so we need to import this
apparently unused module instead.
*/
/* eslint-disable no-unused-vars */
import regeneratorRuntime from 'regenerator-runtime';
/* eslint-enable no-unused-vars */

import App from '../App';

test('renders without crashing', () => {
    render(<App suppressLogging={true} />);
});

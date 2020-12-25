import React from 'react';
import PropTypes from 'prop-types';
import './App.css';

import MainView from './MainView';

/**
 * Top-level component in the application.
 * @returns {string} JSX describing how to render the application.
 */
class App extends React.Component {
    render = () => (
        <div className="App container">
            <MainView suppressLogging={this.props.suppressLogging} />
        </div>
    );

    static propTypes = {
        suppressLogging: PropTypes.bool,
    }
}

export default App;

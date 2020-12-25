import React from 'react';
import PropTypes from 'prop-types';

import Delete from './Delete';
import Get from './Get';
import Post from './Post';
import Put from './Put';
import SimpleGet from './SimpleGet';

/**
 * Parent component which allows navigation between the SimpleGet, Get, Post, Put and 
 * Delete components.
 */
export default class MainView extends React.Component {
    /**
     * Initializes a new instance of the MainView component.
     * @param {object} props Values passed from the parent component as JSX attributes.
     */
    constructor(props) {
        super(props);
        this.state = {
            activePage: 'SimpleGet',
            requestMechanism: 'fetch',
            screenDebug: false,
            httpLogging: props.suppressLogging ? false : true,
        };
    }

    static propTypes = {
        suppressLogging: PropTypes.bool,
    }
    
    /**
     * Called by the React runtime when the component's state changes.
     * @returns {string} JSX representing the component.
     */
    render = () => {
        const mechanismSelector = (
            <div>
                <div className="input-group">
                    <div className="input-group-prepend">
                        <label htmlFor="httpRequestMechanism-dropdown" className="input-group-text">
                            HTTP request mechanism
                        </label>
                    </div>
                    <select 
                        id="httpRequestMechanism-dropdown" 
                        className="form-control"
                        onChange={(e) => this.setState({requestMechanism: e.target.value})}
                    >
                        <option value="fetch">fetch</option>
                        <option value="axios">axios</option>
                    </select>
                </div>
            </div>
        );

        const debugControls = (
            <div>
                <div className="input-group">
                    <div className="input-group-prepend">
                        <label htmlFor="screenDebug-checkbox" className="input-group-text">
                            Display props and state on-screen
                        </label>
                    </div>
                    <input 
                        type="checkbox" 
                        id="screenDebug-checkbox" 
                        className="form-control" 
                        checked={this.state.screenDebug}
                        onChange={(e) => this.setState({screenDebug: e.target.checked})}
                    />
                </div>
                <div className="input-group">
                    <div className="input-group-prepend">
                        <label htmlFor="consoleDebug-checkbox" className="input-group-text">
                            Log HTTP activity to console
                        </label>
                    </div>
                    <input 
                        type="checkbox" 
                        id="consoleDebug-checkbox" 
                        className="form-control" 
                        checked={this.state.httpLogging}
                        onChange={(e) => this.setState({httpLogging: e.target.checked})}
                    />
                </div>
            </div>
        );

        const button = (buttonText, activePage) => {
            const active = this.state.activePage === activePage;
            const returnValue = (
                <button 
                    onClick={() => this.setState({activePage: `${activePage}`})}
                    className={`nav-link btn ${active? "btn-outline-primary disabled" : "btn-outline-secondary"}`}
                >
                    {buttonText}
                </button>
            );
            return returnValue;
        };

        const nav = (
            <nav className="navbar sticky-top navbar-expand-lg justify-content-center navbar-light bg-light">
                {button('Simple GET', 'SimpleGet')}
                &nbsp;
                {button('GET', 'Get')}
                &nbsp;
                {button('PUT', 'Put')}
                &nbsp;
                {button('POST', 'Post')}
                &nbsp;
                {button('DELETE', 'Delete')}
            </nav>
        );

        let childComponent;

        // Stop ESLint complaining about the fact there's no default case
        /* eslint-disable-next-line */
        switch (this.state.activePage) {
            case 'SimpleGet':
                childComponent = (
                    <SimpleGet 
                        httpRequestMechanism={this.state.requestMechanism} 
                        showPropsAndState={this.state.screenDebug} 
                        httpLogging={this.state.httpLogging}
                    />
                );
                break;

            case 'Get':
                childComponent = (
                    <Get 
                        httpRequestMechanism={this.state.requestMechanism} 
                        showPropsAndState={this.state.screenDebug} 
                        httpLogging={this.state.httpLogging}
                    />
                );
                break;
                
            case 'Post':
                childComponent = (
                    <Post 
                        httpRequestMechanism={this.state.requestMechanism} 
                        showPropsAndState={this.state.screenDebug} 
                        httpLogging={this.state.httpLogging}
                    />
                );
                break;
                
            case 'Put':
                childComponent = (
                    <Put
                        httpRequestMechanism={this.state.requestMechanism} 
                        showPropsAndState={this.state.screenDebug} 
                        httpLogging={this.state.httpLogging}
                    />
                );
                break;
                
            case 'Delete':
                childComponent = (
                    <Delete 
                        httpRequestMechanism={this.state.requestMechanism} 
                        showPropsAndState={this.state.screenDebug} 
                        httpLogging={this.state.httpLogging}
                    />
                );
                break;
        }

        return (
            <div>
                {nav}
                {mechanismSelector}
                {debugControls}
                {childComponent}
            </div>
        );
    }
}
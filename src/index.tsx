import React from 'react';
import createRoot from 'react-dom';
import './index.css';
import {App} from './app/App';
import * as serviceWorker from './serviceWorker';
import {Provider} from "react-redux";
import {store} from './app/store';
import {HashRouter} from "react-router-dom";

createRoot.render(
    <HashRouter>
        <Provider store={store}>
            <App/>
        </Provider>
    </HashRouter>
    , document.getElementById('root'));

// в gh-pages лучше работает HashRouter

serviceWorker.unregister();

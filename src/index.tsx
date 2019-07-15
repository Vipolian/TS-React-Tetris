import React from 'react';
import { Router } from 'react-router';
import { hydrate, render } from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { createBrowserHistory } from 'history';

import Main from 'conteiners/Main';
import './index.css';

const rootElem = document.getElementById('root');

export const history = createBrowserHistory();

const App = (
  <Router history={history}>
    <Main />
  </Router>
);

if (rootElem != null && rootElem.hasChildNodes()) {
  hydrate(App, rootElem)
} else {
  render(App, rootElem)
}


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();

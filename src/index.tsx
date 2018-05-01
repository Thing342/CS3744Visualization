import * as React from 'react';
import * as ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.css';

import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

/**
 * Bootstrapping code, the "main method".
 * @author Wes Jordan, Copyright 2018.
 */

/* tslint:disable:no-string-literal */
ReactDOM.render(
  <App backend={window['backend']} userlevel={window['userlevel']} />,
  document.getElementById('root') as HTMLElement
);

console.log(window['backend']);
/* tslint:enable:no-string-literal */

registerServiceWorker();

import React from 'react';
import ReactDOM from 'react-dom';
import UIKit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';

import App from './App/App';
import * as serviceWorker from './serviceWorker';

import 'uikit/dist/css/uikit.min.css';

import './index.scss';

// loads the Icon plugin
UIKit.use(Icons);

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();

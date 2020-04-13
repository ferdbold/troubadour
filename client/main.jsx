import { Meteor } from 'meteor/meteor';
import React from 'react';
import { render } from 'react-dom';

import UIKit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import 'uikit/dist/css/uikit.min.css';

import App from '/imports/ui/App/App.jsx';

import './main.scss';

UIKit.use(Icons);

Meteor.startup(() => {
  render(<App />, document.getElementById('root'));
});

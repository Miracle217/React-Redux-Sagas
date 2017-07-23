'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Root from 'components/Root';
import store, { history } from 'app/store';
import USER from 'action-types/user';
import buildAction from 'helpers/buildAction';

ReactDOM.render(<Root store={store} history={history} />, document.getElementById('main'));

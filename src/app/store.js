'use strict';

import { compose, createStore, combineReducers, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';

import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import userReducer from 'reducers/user';
import uiReducer from 'reducers/ui';
import dashboardReducer from 'reducers/dashboard';
import twitterReducer from 'reducers/twitter';
import checkoutReducer from 'reducers/checkout';
import sellerReducer from 'reducers/seller';
import sellerProducts from 'reducers/sellerProducts';

import userSaga from 'sagas/user';
import uiSaga from 'sagas/ui';
import sellerSaga from 'sagas/seller';
import signupSaga from 'sagas/signup';
import dashboardSaga from 'sagas/dashboard';
import twitterSaga from 'sagas/twitter';
import checkoutSaga from 'sagas/checkout';
import sellerProductSaga from 'sagas/sellerProducts';

import createLogger from 'redux-logger';

const sagaMiddleware = createSagaMiddleware();

const initialState = {
  ui: {
    expandMenu: false,
    expandedLogin: false,
    loginNumber: '',
    loadingMessage: 'Loading ...',
    notifications: [],
    nolayout: false,
    title: '',
    message:''
  },
  user: {
    checked: false
  },
  twitter: {
    optoutParams: {}
  },
  checkout: {
    checkoutParams: {},
    isPhoneExist: false,
    formSubmitted: false
  }
};

const logger = createLogger();
// Add the reducer to your store on the `routing` key
const store = createStore(
  combineReducers({
    ui: uiReducer,
    user: userReducer,
    routing: routerReducer,
    dashboard: dashboardReducer,
    twitter: twitterReducer,
    checkout: checkoutReducer,
    form: formReducer,
    seller: sellerReducer,
    sellerProduct :sellerProducts
  }),
  initialState,
  compose(
    applyMiddleware(logger, sagaMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);

sagaMiddleware.run(uiSaga);
sagaMiddleware.run(userSaga);
sagaMiddleware.run(signupSaga);
sagaMiddleware.run(dashboardSaga);
sagaMiddleware.run(twitterSaga);
sagaMiddleware.run(sellerSaga);
sagaMiddleware.run(checkoutSaga);
sagaMiddleware.run(sellerProductSaga);

export const history = syncHistoryWithStore(browserHistory, store);

export default store;

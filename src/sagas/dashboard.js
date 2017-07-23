import { takeEvery } from 'redux-saga';
import { call, put, fork, select } from 'redux-saga/effects';
import buildAction from 'helpers/buildAction';
import USER from 'action-types/user';
import UI from 'action-types/ui';
import DASHBOARD from 'action-types/dashboard';
import { storage, delay, firebase, createRequest, createToken, signupRoute, getTwitterCallback, getInstagramCallback, payload as pl } from 'helpers';
import { root, dashboard, signup, receipt, history } from 'app/routes';
import { browserHistory } from 'react-router';
import { updateUser, updateEmail, fetchCards } from './user';
import { locationHref } from './ui';

// TODO: No more putting saga actions from sagas!

export function * submitPhone (action) {
  try {
    const number = action.payload;
    yield put(buildAction(UI.LOAD_START));
    yield put(buildAction(UI.CLEAR_NOTIFICATIONS));
    const response = yield createRequest('requestConfirmationCode', {number, context: 'edit'});
    yield put(buildAction(UI.STORE_DASHBOARD_NUMBER, number));
    yield put(buildAction(UI.ADD_NOTIFICATION, {message: response.message, filter: 'phoneNumber'}));
    yield put(buildAction(UI.LOAD_END));
  } catch (e) {
    console.error(e);
    yield put(buildAction(UI.STORE_SIGNUP_NUMBER, null));
    yield put(buildAction(UI.ADD_NOTIFICATION, {message: e.message || e, level: 'alert', filter: 'phoneNumber'}));
    yield put(buildAction(UI.LOAD_END));
  }
}

export function * confirmCode (action) {
  try {
    const state = yield select();
    const code = action.payload;
    const number = state.ui.dashboardNumber;
    yield put(buildAction(UI.LOAD_START));
    yield put(buildAction(UI.CLEAR_NOTIFICATIONS));
    const response = yield createRequest('validateConfirmationCode', {number, code, context: 'edit'});
    yield put(buildAction(UI.STORE_DASHBOARD_NUMBER, null));
    yield updateUser(pl({mobileNumber: number}));
    yield put(buildAction(UI.ADD_NOTIFICATION, {message: response.message, filter: 'phoneNumber'}));
    yield put(buildAction(UI.LOAD_END));
  } catch (e) {
    console.error(e);
    yield put(buildAction(UI.ADD_NOTIFICATION, {message: e.message || e, level: 'alert', filter: 'phoneNumber'}));
    yield put(buildAction(UI.LOAD_END));
  }
}

export function * twitterConnect () {
  try {
    yield put(buildAction(UI.LOAD_START));
    const { login_url: loginUrl, oauth_token, oauth_token_secret } = yield createRequest('getTwitterLoginUrl', {callback: getTwitterCallback('dashboard')});
    storage.setItem('twitter_oauth_token', oauth_token);
    storage.setItem('twitter_oauth_token_secret', oauth_token_secret);
    return yield locationHref(pl(loginUrl));
  } catch (e) {
    console.error(e);
    yield put(buildAction(UI.ADD_NOTIFICATION, {message: e.message || e, level: 'alert', filter: 'socialMedia'}));
    yield put(buildAction(UI.LOAD_END));
  }
}

export function * instagramConnect () {
  try {
    yield put(buildAction(UI.LOAD_START));
    const loginUrl = yield createRequest('getInstagramLoginUrl', {callback: getInstagramCallback('dashboard')});
    return yield locationHref(pl(loginUrl));
  } catch (e) {
    console.error(e);
    yield put(buildAction(UI.ADD_NOTIFICATION, {message: e.message || e, level: 'alert', filter: 'socialMedia'}));
    yield put(buildAction(UI.LOAD_END));
  }
}

export function * removeInstagram () {
  try {
    yield put(buildAction(UI.LOAD_START));
    yield updateUser(pl({instagramAuth: null, instagramId: null}));
    yield put(buildAction(UI.ADD_NOTIFICATION, {message: 'Instagram account removed', filter: 'socialMedia'}));
    yield put(buildAction(UI.LOAD_END));
  } catch (e) {
    console.error(e);
    yield put(buildAction(UI.ADD_NOTIFICATION, {message: e.message || e, level: 'alert', filter: 'socialMedia'}));
    yield put(buildAction(UI.LOAD_END));
  }
}

export function * removeTwitter () {
  try {
    yield put(buildAction(UI.LOAD_START));
    yield updateUser(pl({twitterAuth: null, twitterId: null}));
    yield put(buildAction(UI.ADD_NOTIFICATION, {message: 'Twitter account removed', filter: 'socialMedia'}));
    yield put(buildAction(UI.LOAD_END));
  } catch (e) {
    console.error(e);
    yield put(buildAction(UI.ADD_NOTIFICATION, {message: e.message || e, level: 'alert', filter: 'mailingAddress'}));
    yield put(buildAction(UI.LOAD_END));
  }

}

export function * submitAddress (action) {
  try {
    const {firstName, lastName, address1, address2, city, state, postalCode, country} = action.payload;
    const mailingAddress = {firstName, lastName, address1, address2, city, state, postalCode, country};
    yield put(buildAction(UI.LOAD_START));
    yield put(buildAction(UI.CLEAR_NOTIFICATIONS));
    yield updateUser(pl({mailingAddress}));
    yield put(buildAction(UI.ADD_NOTIFICATION, {message: 'Mailing address has been updated', filter: 'mailingAddress'}));
    yield put(buildAction(UI.LOAD_END));
  } catch (e) {
    console.error(e);
    yield put(buildAction(UI.ADD_NOTIFICATION, {message: e.message || e, level: 'alert', filter: 'mailingAddress'}));
    yield put(buildAction(UI.LOAD_END));
  }
}

export function * submitEmail (action) {
  try {
    const emailAddress = action.payload;
    yield put(buildAction(UI.LOAD_START));
    yield put(buildAction(UI.CLEAR_NOTIFICATIONS));
    yield updateEmail(pl(emailAddress));
    yield updateUser(pl({pendingEmail: emailAddress}));
    yield put(buildAction(UI.ADD_NOTIFICATION, {message:'Email change is pending. Please check your inbox for confirmation', filter: 'email'}));
    yield put(buildAction(UI.LOAD_END));
  } catch (e) {
    console.error(e);
    yield put(buildAction(UI.ADD_NOTIFICATION, {message: e.message || e, level: 'alert', filter: 'email'}));
    yield put(buildAction(UI.LOAD_END));
  }
}

export function * submitPayment (action) {
  try {
    const cardInfo = action.payload;
    const stripeToken = yield createToken(cardInfo);
    yield put(buildAction(UI.LOAD_START));
    yield put(buildAction(UI.CLEAR_NOTIFICATIONS));
    const response = yield createRequest('submitPayment', {stripeToken});
    yield put(buildAction(UI.ADD_NOTIFICATION, {message: 'Credit Card Added', filter: 'payment'}));
    yield put(buildAction(DASHBOARD.CLEAR_MODALS));
    yield fetchCards();
    yield put(buildAction(UI.LOAD_END));
  } catch (e) {
    console.error(e);
    yield put(buildAction(UI.ADD_NOTIFICATION, {message: e.message || e, level: 'alert', filter: 'phone'}));
    yield put(buildAction(UI.LOAD_END));
  }
}

export function * removePayment (action) {
  try {
    const cardId = action.payload;
    yield put(buildAction(UI.LOAD_START));
    yield put(buildAction(UI.CLEAR_NOTIFICATIONS));
    const response = yield createRequest('removePayment', cardId);
    yield put(buildAction(UI.ADD_NOTIFICATION, {message: 'Credit Card Removed', filter: 'payment'}));
    yield fetchCards();
    yield put(buildAction(UI.LOAD_END));
  } catch (e) {
    console.error(e);
    yield put(buildAction(UI.ADD_NOTIFICATION, {message: e.message || e, level: 'alert', filter: 'payment'}));
    yield put(buildAction(UI.LOAD_END));
  }
}

export function * updatePayment (action) {
  try {
    const {cardId, exp_month, exp_year, address_zip} = action.payload;
    yield put(buildAction(UI.LOAD_START));
    yield put(buildAction(UI.CLEAR_NOTIFICATIONS));
    const response = yield createRequest('updatePayment', {cardId, exp_month, exp_year, address_zip});
    yield put(buildAction(UI.ADD_NOTIFICATION, {message: 'Credit Card Updated', filter: 'payment'}));
    yield put(buildAction(DASHBOARD.CLEAR_MODALS));
    yield fetchCards();
    yield put(buildAction(UI.LOAD_END));
  } catch (e) {
    console.error(e);
    yield put(buildAction(UI.ADD_NOTIFICATION, {message: e.message || e, level: 'alert', filter: 'payment'}));
    yield put(buildAction(UI.LOAD_END));
  }
}

export default function * (getState) {
  yield [
    takeEvery(DASHBOARD.SUBMIT_PHONE, submitPhone),
    takeEvery(DASHBOARD.CONFIRM_CODE, confirmCode),
    takeEvery(DASHBOARD.INSTAGRAM_CONNECT, instagramConnect),
    takeEvery(DASHBOARD.REMOVE_INSTAGRAM, removeInstagram),
    takeEvery(DASHBOARD.TWITTER_CONNECT, twitterConnect),
    takeEvery(DASHBOARD.REMOVE_TWITTER, removeTwitter),
    takeEvery(DASHBOARD.SUBMIT_ADDRESS, submitAddress),
    takeEvery(DASHBOARD.SUBMIT_EMAIL, submitEmail),
    takeEvery(DASHBOARD.SUBMIT_PAYMENT, submitPayment),
    takeEvery(DASHBOARD.REMOVE_PAYMENT, removePayment),
    takeEvery(DASHBOARD.UPDATE_PAYMENT, updatePayment)
  ];
}

/* global ga */

import { takeEvery } from 'redux-saga';
import { put, select } from 'redux-saga/effects';
import SELLER from 'action-types/seller';
import UI from 'action-types/ui';
import { buildAction, createRequest, createToken, storageGetObject, storageSetObject, getTwitterCallback, getInstagramCallback, firebase, payload as pl } from 'helpers';
import * as routes from 'app/routes';
import validator from 'validator';
import { getValue } from 'helpers';
import { historyPush, locationHref } from './ui';
const storage = localStorage;

export function * storeSellerCompany ({ payload: { values, resolve, reject } }) {
  try {
    const { companyName } = values;
    yield put(buildAction(UI.LOAD_START));
    yield put(buildAction(UI.CLEAR_NOTIFICATIONS));
    const response = yield createRequest('createSeller', {...values, step: 1 });
    yield put(buildAction(SELLER.STORE_INFO, {...values, slug: response, step: 1 }));
    yield put(buildAction(SELLER.CHANGE_STEP, 2));
    yield put(buildAction(UI.LOAD_END));
    resolve();
  } catch (e) {
    console.error(e);
    yield put(buildAction(UI.ADD_NOTIFICATION, {message: e.message || e, level: 'alert'}));
    yield put(buildAction(UI.LOAD_END));
    reject(e);
  }
}


export function * storeSellerLoginInfo ({ payload: { values, resolve, reject } }) {
  try {
    yield put(buildAction(UI.LOAD_START));
    yield put(buildAction(UI.CLEAR_NOTIFICATIONS));
    if (!validator.isEmail(values.email)) {
      throw new Error('Invalid Email');
    }
    if (values.password.length < 6) {
      throw new Error('Password must be at least 6 characters in length');
    }
    const response = yield createRequest('createSeller', {...values, step: 2, infoStep: 1 });
    yield put(buildAction(SELLER.STORE_INFO, {userInfo: values, step: 2, infoStep: 1}));
    yield put(buildAction(SELLER.CHANGE_INFO_STEP, 2));
    yield put(buildAction(UI.LOAD_END));
    resolve();
  } catch (e) {
    console.error(e);
    yield put(buildAction(UI.ADD_NOTIFICATION, {message: e.message || e, level: 'alert'}));
    yield put(buildAction(UI.LOAD_END));
    reject(e);
  }
}

export function * storeSellerCompanyInfo ({ payload: { values, resolve, reject } }) {
  const { seller: { prefix, company, userInfo } } = yield select();

  try {
    yield put(buildAction(UI.LOAD_START));
    yield put(buildAction(UI.CLEAR_NOTIFICATIONS));
    const response = yield createRequest('createSeller', { prefix, company, userInfo, companyInfo: values, step: 2, infoStep: 2 });
    const { accountId, uid } = response;
    const account = yield getValue(`accounts/${accountId}`);
    if (!account) {
      throw new Error('Invalid Seller Account');
    }
    yield put(buildAction(SELLER.STORE_INFO,  { account, step: 2, infoStep: 2 }));
    yield put(buildAction(SELLER.CHANGE_STEP, 3));
    storageSetObject('sellerOnboarding', {accountId, step: 3});
    yield put(buildAction(UI.LOAD_END));
    resolve();
  } catch (e) {
    console.error(e);
    yield put(buildAction(UI.ADD_NOTIFICATION, {message: e.message || e, level: 'alert'}));
    yield put(buildAction(UI.LOAD_END));
    reject(e);
  }
}

export function * submitSubscription (action) {
  try {
    const cardInfo = action.payload;
    const stripeToken = yield createToken(cardInfo);
    const { accountId } = storageGetObject('sellerOnboarding');
    yield put(buildAction(UI.LOAD_START));
    yield put(buildAction(UI.CLEAR_NOTIFICATIONS));
    const response = yield createRequest('createSeller', {accountId, stripeToken, step: 3, paymentStep: 1});
    const { stripeCustomerId } = response;
    yield put(buildAction(SELLER.STORE_INFO, {stripeCustomerId: stripeCustomerId, step: 3, paymentStep: 1}));
    storageSetObject('sellerOnboarding', {accountId, step: 3, paymentStep: 2});
    yield put(buildAction(SELLER.CHANGE_PAYMENT_STEP, 2));
    yield put(buildAction(UI.LOAD_END));
  } catch (e) {
    console.error(e);
    yield put(buildAction(UI.ADD_NOTIFICATION, {message: e.message || e, level: 'alert'}));
    yield put(buildAction(UI.LOAD_END));
  }
}

export function * twitterConnect () {
  try {
    yield put(buildAction(UI.LOAD_START));
    const { login_url: loginUrl, oauth_token, oauth_token_secret } = yield createRequest('getTwitterLoginUrl', {callback: getTwitterCallback('seller')});
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
    const loginUrl = yield createRequest('getInstagramLoginUrl', {callback: getInstagramCallback('seller')});
    return yield locationHref(pl(loginUrl));
  } catch (e) {
    console.error(e);
    yield put(buildAction(UI.ADD_NOTIFICATION, {message: e.message || e, level: 'alert', filter: 'socialMedia'}));
    yield put(buildAction(UI.LOAD_END));
  }
}

export function * logout () {
  yield firebase.auth().signInAnonymously();
  yield historyPush(pl(routes.root));
  storage.clear();
}

export default function * (getState) {
  yield [
    takeEvery(SELLER.STORE_SELLER_COMPANY, storeSellerCompany),
    takeEvery(SELLER.STORE_SELLER_LOGIN_INFO, storeSellerLoginInfo),
    takeEvery(SELLER.STORE_SELLER_COMPANY_INFO, storeSellerCompanyInfo),
    takeEvery(SELLER.SUBMIT_SUBSCRIPTION, submitSubscription),
    takeEvery(SELLER.INSTAGRAM_CONNECT, instagramConnect),
    takeEvery(SELLER.TWITTER_CONNECT, twitterConnect),
    takeEvery(SELLER.LOGOUT, logout)
  ];
}

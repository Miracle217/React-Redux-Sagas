'use strict';

import { takeEvery } from 'redux-saga';
import SELLER from 'action-types/seller';
import { put } from 'redux-saga/effects';
import { firebase, buildAction, createRequest, delay, getValue, storageGetObject} from 'helpers';
import TWITTER from 'action-types/twitter';
import { ORIGIN_URL} from '../app/routes';
import UI from 'action-types/ui';
import { historyPush } from 'sagas/ui';

const storage = localStorage;
export function * requestOptout (action) {
  const {twitterId, code, optOut} = action.payload;
  try {
    yield put(buildAction(TWITTER.OPTOUT_PARAMS, {processing: true}));
    yield createRequest('optoutTwitter', {twitterId, code, optOut});
    yield put(buildAction(TWITTER.OPTOUT_PARAMS, {processing: false, optedOut: optOut, complete: true}));
    yield delay(2000);
    yield historyPush({payload: '/'});
  } catch (err) {
    yield put(buildAction(TWITTER.OPTOUT_PARAMS, {processing: false, error: err.message || err}));
    yield delay(2000);
    yield historyPush({payload: '/'});
  }
}

function * twitterAuth (action) {
  const { accountId } = action.payload;
  const routeAction = action.payload.action;

  yield put(buildAction(UI.LOAD_START));
  yield put(buildAction(UI.CLEAR_NOTIFICATIONS));
  /* eslint-disable camelcase */
  const { login_url: loginUrl, oauth_token, oauth_token_secret } = yield createRequest(firebase, 'getTwitterLoginUrl', {callback: `${ORIGIN_URL}/auth/callback/twitter?action=${routeAction}&accountId=${accountId}`});
  storage.setItem('twitter_oauth_token', oauth_token);
  storage.setItem('twitter_oauth_token_secret', oauth_token_secret);
  /* eslint-enable camelcase */

  return window.location.href = loginUrl;
}

function * twitterCallback (action) {
  const { location } = action.payload;
  const { query } = location;
  try {
    yield put(buildAction(UI.BLANK_MESSAGE, {title: 'Twitter Authorization', message: 'Please wait while we authorize your Twitter account.'}));
    /* eslint-disable camelcase */
    const { action, oauth_verifier } = query;
    const oauth_token = storage.getItem('twitter_oauth_token');
    const oauth_token_secret = storage.getItem('twitter_oauth_token_secret');
    storage.removeItem('twitter_oauth_token');
    storage.removeItem('twitter_oauth_token_secret');
    /* eslint-enable camelcase */

    const sellerData = storageGetObject('sellerOnboarding');
    const { accountId } = sellerData;
    const account = yield getValue(`accounts/${accountId}`);

    if (!account) {
      throw new Error('Account not found');
    }
    if (!oauth_verifier) {
      throw new Error('No access token');
    }
    const response = yield createRequest('getTwitterAuthInfo', {oauth_token, oauth_token_secret, oauth_verifier, action});

    const result = yield createRequest('setTwitterAuthInfo', {accountId: accountId, twitterId: response.user_id, twitterAuth: response});

    yield [
      put(buildAction(UI.HISTORY_PUSH, '/seller/join.html')),
      put(buildAction(SELLER.STORE_SELLER_NEXT_INFO,  { currentStep:4, account: account }))
    ];
  } catch (e) {
    console.log('errors', e);
    // Rollbar.error(e);
    // yield waitFor(3000);
    yield [
      put(buildAction(SELLER.STORE_SELLER_NEXT_INFO,  {currentStep:4})),
      put(buildAction(UI.HISTORY_PUSH, '/seller/join.html')),
      put(buildAction(UI.BLANK_MESSAGE, {title: 'Twitter Authorization', message: e.message}))
    ];
  }
}

export default function * combineTwitter () {
  yield [
    takeEvery(TWITTER.REQUEST_OPTOUT, requestOptout),
    takeEvery(TWITTER.TWITTER_AUTH, twitterAuth),
    takeEvery(TWITTER.TWITTER_CALLBACK, twitterCallback)
  ];
}

import { takeEvery } from 'redux-saga';
import { put, select } from 'redux-saga/effects';
import USER from 'action-types/user';
import UI from 'action-types/ui';
import { root, signup } from 'app/routes';
import { buildAction, firebase, createRequest, storage, getTwitterCallback, getInstagramCallback, payload as pl } from 'helpers';
import { historyPush, locationHref, postLogin } from './ui';

// TODO: No more putting saga actions from sagas!
const getFBCurrentUser = () => {
  const user = firebase.auth().currentUser;
  if (user) {
    return Promise.resolve(user);
  }

  return new Promise((resolve) => {
    firebase.auth().onAuthStateChanged(resolve);
  });
};

export function * userCheck () { // skip route check when we have a redirect pending
  // if all else fails, login as anonymous
  const auth = yield getFBCurrentUser();
  if (!auth || (auth.expires < Date.now() / 1000)) {
    yield firebase.auth().signInAnonymously();
    yield put(buildAction(USER.CHECKED));
    return;
  }
  if (auth.isAnonymous) {
    yield put(buildAction(USER.CHECKED));
    return;
  }
  const userSnap = yield firebase.child(`users/${auth.uid}`).once('value');
  const id  = userSnap.key;
  const data = userSnap.val();
  yield put(buildAction(USER.SET_USER, {id, data}));
  yield put(buildAction(USER.CHECKED));
}

export function * logout () {
  yield put(buildAction(UI.CLEAR_NOTIFICATIONS));
  yield put(buildAction(UI.STORE_SIGNUP_NUMBER, null));
  yield put(buildAction(UI.STORE_LOGIN_NUMBER, null));
  yield put(buildAction(UI.COLLAPSE_LOGIN));
  yield put(buildAction(USER.SET_USER, {}));
  yield firebase.auth().signInAnonymously();
  yield historyPush(pl(root));
}

export function * phoneLogin (action) {
  try {
    const { number } = action.payload;
    yield put(buildAction(UI.LOAD_START));
    yield put(buildAction(UI.CLEAR_NOTIFICATIONS));
    const response = yield createRequest('requestConfirmationCode', {number, context: 'login'});
    if (response.signup) {
      yield put(buildAction(UI.STORE_SIGNUP_NUMBER, number));
      yield put(buildAction(UI.LOAD_END));
      yield put(buildAction(UI.ADD_NOTIFICATION, response.message));
      return yield historyPush(pl(signup));
    }
    yield put(buildAction(UI.STORE_LOGIN_NUMBER, number));
    yield put(buildAction(UI.EXPAND_LOGIN));
    yield put(buildAction(UI.LOAD_END));
    yield put(buildAction(UI.ADD_NOTIFICATION, response.message));
  } catch (e) {
    console.error(e);
    yield put(buildAction(UI.LOAD_END));
    yield put(buildAction(UI.ADD_NOTIFICATION, {message: e.message || e, level: 'alert'}));
  }
}

export function * phoneLoginConfirm (action) {
  try {
    const { number, code } = action.payload;
    yield put(buildAction(UI.LOAD_START));
    yield put({type: UI.CLEAR_NOTIFICATIONS});
    const response = yield createRequest('validateConfirmationCode', {number, code, context: 'login'});
    const auth = yield firebase.auth().signInWithCustomToken(response.token);
    yield userCheck();
    yield put(buildAction(UI.ADD_NOTIFICATION, 'User logged in'));
    yield put(buildAction(UI.STORE_LOGIN_NUMBER, null));
    yield put(buildAction(UI.COLLAPSE_LOGIN));
    yield put(buildAction(UI.LOAD_END));
    yield postLogin();
  } catch (e) {
    console.error(e);
    yield put(buildAction(UI.LOAD_END));
    yield put(buildAction(UI.ADD_NOTIFICATION, {message: e.message || e, level: 'alert'}));
  }
}

export function * triggerExpress (action) {
  try {
    yield put(buildAction(UI.CLEAR_NOTIFICATIONS, {message: `We just sent a link to ${number}`}));
    const { hashtag, number } = action.payload;
    const response = yield createRequest('triggerExpress', {hashtag, number});
    yield put(buildAction(UI.ADD_NOTIFICATION, {message: `We just sent a link to ${number}`}));
    yield put(buildAction(USER.TRIGGERED_EXPRESS, {hashtag, number}));
  } catch (e) {
    console.error(e);
    yield put(buildAction(UI.LOAD_END));
    yield put(buildAction(UI.ADD_NOTIFICATION, {message: e.message || e, level: 'alert'}));
  }
}

export function * emailLogin (action) {
  try {
    const { email } = action.payload;
    yield put(buildAction(UI.LOAD_START));
    yield put(buildAction(UI.CLEAR_NOTIFICATIONS));
    const response = yield createRequest('requestConfirmationCode', {email, context: 'emailLogin'});
    if (response.signup) {
      yield put(buildAction(UI.STORE_SIGNUP_EMAIL, email));
      yield put(buildAction(UI.LOAD_END));
      yield put(buildAction(UI.ADD_NOTIFICATION, response.message));
      return yield historyPush(pl(signup));
    }
    yield put(buildAction(UI.STORE_LOGIN_EMAIL, email));
    yield put(buildAction(UI.EXPAND_LOGIN));
    yield put(buildAction(UI.LOAD_END));
    yield put(buildAction(UI.ADD_NOTIFICATION, response.message));
  } catch (e) {
    console.error(e);
    yield put(buildAction(UI.LOAD_END));
    yield put(buildAction(UI.ADD_NOTIFICATION, {message: e.message || e, level: 'alert'}));
  }
}

export function * emailLoginConfirm (action) {
  try {
    const { email, code } = action.payload;
    yield put(buildAction(UI.LOAD_START));
    yield put({type: UI.CLEAR_NOTIFICATIONS});
    const response = yield createRequest('validateConfirmationCode', {email, code, context: 'emailLogin'});
    const auth = yield firebase.auth().signInWithCustomToken(response.token);
    yield userCheck();
    yield put(buildAction(UI.ADD_NOTIFICATION, 'User logged in'));
    yield put(buildAction(UI.STORE_LOGIN_EMAIL, null));
    yield put(buildAction(UI.COLLAPSE_LOGIN));
    yield put(buildAction(UI.LOAD_END));
    yield postLogin();
  } catch (e) {
    console.error(e);
    yield put(buildAction(UI.LOAD_END));
    yield put(buildAction(UI.ADD_NOTIFICATION, {message: e.message || e, level: 'alert'}));
  }
}

function * twitterLogin () {
  try {
    /* eslint-disable camelcase */
    const { login_url: loginUrl, oauth_token, oauth_token_secret } = yield createRequest('getTwitterLoginUrl', {callback: getTwitterCallback('login')});
    storage.setItem('twitter_oauth_token', oauth_token);
    storage.setItem('twitter_oauth_token_secret', oauth_token_secret);
    /* eslint-enable camelcase */
    yield locationHref(pl(loginUrl));
  } catch (e) {
    console.error(e);
    yield put(buildAction(UI.ADD_NOTIFICATION, {message: e.message || e, level: 'alert'}));
  }
}

function * instagramLogin () {
  try {
    const loginUrl = yield createRequest('getInstagramLoginUrl', {callback: getInstagramCallback('login')});
    yield locationHref(pl(loginUrl));
  } catch (e) {
    console.error(e);
    yield put(buildAction(UI.ADD_NOTIFICATION, {message: e.message || e, level: 'alert'}));
  }
}

export function * updateUser (action) {
  const state = yield select();
  yield firebase.child(`users/${state.user.id}`).update(action.payload);
  // TODO: maybe use this request instead of setting the value directly
  yield createRequest('updateUser', action.payload);
  const userSnap = yield firebase.child(`users/${state.user.id}`).once('value');
  const id = state.user.id;
  const data = userSnap.val();
  yield put(buildAction(USER.SET_USER, {id, data}));
}

export function * updateEmail (action) {
  const email = action.payload;
  return yield createRequest('updateEmail', email);
}

export function * fetchReceipts (action = {}) {
  try {
    const currentReceiptKey = action.payload;
    const state = yield select();
    const receipts = {};
    const userId = state.user.id;
    yield put(buildAction(UI.LOAD_START));
    const receiptsSnap = yield firebase.child(`receipts/${state.user.id}`).once('value');
    const receiptRefs = receiptsSnap.val() || {};
    let currentReceipt = null;

    // TODO: simplify this
    const receiptKeys = Object.keys(receiptRefs);
    for (let i = receiptKeys.length - 1; i >= 0; i--) {
      const key = receiptKeys[i];
      const transactionRef = receiptRefs[key];
      const transactionSnap = yield firebase.child(`transactions/${transactionRef}`).once('value');
      const transaction = transactionSnap.val();
      const accountSnap = yield firebase.child(`accounts/${transaction.accountId}`).once('value');
      const productSnap = yield firebase.child(`products/${transaction.accountId}/${transaction.productId}`).once('value');
      const account = accountSnap.val();
      const product = productSnap.val();

      delete account.stripeCredentials;
      delete account.shopifyCredentials;
      delete account.magentoCredentials;
      delete account.instagramAuth;
      delete account.twitterAuth;

      transaction.account = account;
      transaction.product = product;
      receipts[key] = transaction;
      if (currentReceiptKey === key) {
        currentReceipt = transaction;
      }
    }
    yield put(buildAction(USER.SET_RECEIPTS, receipts));
    if (currentReceipt) {
      yield put(buildAction(USER.SET_CURRENT_RECEIPT, currentReceipt));
    }
    yield put(buildAction(USER.RECEIPTS_CHECKED));
    yield put(buildAction(UI.LOAD_END));
  } catch (e) {
    console.trace(e);
    yield put(buildAction(UI.LOAD_END));
    yield put(buildAction(UI.ADD_NOTIFICATION, {message: e.message || e, level: 'alert'}));
  }
}

export function * fetchCards () {
  try {
    yield put(buildAction(UI.LOAD_START));
    const customer = yield createRequest('fetchPayments');
    yield put(buildAction(USER.SET_CARDS, (customer.sources && customer.sources.data) || []));
    /* eslint-disable camelcase */
    yield put(buildAction(USER.SET_DEFAULT_CARD, customer.default_source));
    /* eslint-enable camelcase */
    yield put(buildAction(UI.LOAD_END));
  } catch (err) {
    console.trace(err);
    yield put(buildAction(UI.LOAD_END));
  }
}

export default function * (getState) {
  return yield [
    //takeEvery(USER.CHECK, userCheck),
    takeEvery(USER.LOGOUT, logout),
    //takeEvery(USER.FETCH_CARDS, fetchCards),
    //takeEvery(USER.FETCH_RECEIPTS, fetchReceipts),
    //takeEvery(USER.UPDATE_USER, updateUser),
    //takeEvery(USER.UPDATE_EMAIL, updateEmail),
    takeEvery(USER.PHONE_LOGIN, phoneLogin),
    takeEvery(USER.PHONE_LOGIN_CONFIRM, phoneLoginConfirm),
    takeEvery(USER.EMAIL_LOGIN, emailLogin),
    takeEvery(USER.EMAIL_LOGIN_CONFIRM, emailLoginConfirm),
    takeEvery(USER.TWITTER_LOGIN, twitterLogin),
    takeEvery(USER.INSTAGRAM_LOGIN, instagramLogin),
    takeEvery(USER.TRIGGER_EXPRESS, triggerExpress)
  ];
}

import { takeEvery } from 'redux-saga';
import { call, put, fork, select } from 'redux-saga/effects';
import UI from 'action-types/ui';
import USER from 'action-types/user';
import SIGNUP from 'action-types/signup';
import { updateUser, updateEmail, userCheck } from './user';
import { historyReplace, historyPush, locationHref } from './ui';
import { root } from 'app/routes';
import { buildAction, storage, delay, firebase, firebaseServerTime, createRequest, createToken,
  signupRoute, getTwitterCallback, getInstagramCallback, payload as pl } from 'helpers';

// TODO: No more putting saga actions from sagas!

export function * signupUserCheck () {
  const { user, ui } = yield select();
  const currentStep = ui.route.params.step;
  let step;

  if (!user.checked) {
    return;
  }
  if (!user.id) {
    if (ui.signupKey && ui.signupNumber) {
      step = 'createAccount';
    } else {
      step = ui.signupNumber ? 'confirmationCode' : 'phoneNumber';
    }
    if (currentStep != step) {
      return yield historyReplace(pl(signupRoute.reverse({step})));
    }
    return;
  }
  if (currentStep == 'confirmationCode' || currentStep == 'phoneNumber') {
    return yield stepCheck();
  }
  if (currentStep == 'payment' && user.data && user.data.stripeCustomerId) {
    return yield stepCheck();
  }
  if (currentStep == 'mailingAddress' && user.data && user.data.mailingAddress) {
    return yield stepCheck();
  }
  //if (currentStep == 'socialMedia' && user.data && (user.data.usingPhone || user.data.twitterId || user.data.instagramId)) {
  //  return yield stepCheck();
  //}
  if (['mailingAddress', 'payment', 'confirmationCode', 'phoneNumber'].indexOf(currentStep) < 0) {
    return yield stepCheck();
  }
}

export function * submitPhone (action) {
  try {
    const number = action.payload;
    yield put(buildAction(UI.LOAD_START));
    yield put(buildAction(UI.CLEAR_NOTIFICATIONS));
    const response = yield createRequest('requestConfirmationCode', {number, context: 'signup'});
    yield put(buildAction(UI.STORE_SIGNUP_NUMBER, number));
    yield put(buildAction(UI.ADD_NOTIFICATION, response.message));
    yield stepCheck();
    yield put(buildAction(UI.LOAD_END));
  } catch (e) {
    console.error(e);
    yield put(buildAction(UI.STORE_SIGNUP_NUMBER, null));
    yield put(buildAction(UI.ADD_NOTIFICATION, {message: e.message || e, level: 'alert'}));
    yield stepCheck();
    yield put(buildAction(UI.LOAD_END));
  }
}

export function * resubmitPhone (action) {
  try {
    const state = yield select();
    const number = state.ui.signupNumber;
    yield put(buildAction(UI.LOAD_START));
    yield put(buildAction(UI.CLEAR_NOTIFICATIONS));
    const response = yield createRequest('requestConfirmationCode', {number, context: 'signup'});
    yield put(buildAction(UI.ADD_NOTIFICATION, response.message));
    yield put(buildAction(UI.LOAD_END));
  } catch (e) {
    console.error(e);
    yield put(buildAction(UI.ADD_NOTIFICATION, {message: e.message || e, level: 'alert'}));
    yield put(buildAction(UI.LOAD_END));
  }
}

export function * confirmCode (action) {
  try {
    const state = yield select();
    const code = action.payload;
    const number = state.ui.signupNumber;
    yield put(buildAction(UI.LOAD_START));
    yield put(buildAction(UI.CLEAR_NOTIFICATIONS));
    const response = yield createRequest('validateConfirmationCode', {number, code, context: 'signup'});
    const auth = yield firebase.auth().signInWithCustomToken(response.token);
    yield userCheck();
    yield updateUser(pl({status: 'active', from: 'signup', created: firebaseServerTime()}));
    yield put(buildAction(UI.ADD_NOTIFICATION, 'Account created successfully.'));
    yield put(buildAction(UI.STORE_SIGNUP_NUMBER, null));
    yield put(buildAction(UI.LOAD_END));
    yield stepCheck();
  } catch (e) {
    console.error(e);
    yield put(buildAction(UI.ADD_NOTIFICATION, {message: e.message || e, level: 'alert'}));
    yield put(buildAction(UI.LOAD_END));
  }
}

export function * stepCheck () {
  const { user, ui } = yield select();
  let step = null;
  // TODO: DRY this
  if (!user.checked) {
    return;
  } else if (!user.data) {
    if (ui.signupKey && ui.signupNumber) {
      step = 'createAccount';
    } else {
      step = ui.signupNumber ? 'confirmationCode' : 'phoneNumber';
    }
  //} else if (!user.data.twitterId && !user.data.instagramId && !user.data.usingPhone) {
  //  step = 'socialMedia';
  } else if (!user.data.mailingAddress) {
    step = 'mailingAddress';
  } else if (!user.data.stripeCustomerId) {
    step = 'payment';
  }
  if (step && step != ui.route.params.step) {
    return yield historyReplace(pl(signupRoute.reverse({step})));
  }
  return yield historyPush(pl(root));
}

function * createAccount (action) {
  try {
    const state = yield select();
    const { signupNumber, signupKey } = state.ui;
    if (!signupNumber || !signupKey) {
      throw new Error('Could not find signup credentials. Please enter your phone number to sign up.');
    }
    const number = signupNumber;
    const code = signupKey;
    yield put(buildAction(UI.LOAD_START));
    yield put(buildAction(UI.CLEAR_NOTIFICATIONS));
    const response = yield createRequest('validateConfirmationCode', {number, code, context: 'smsSignup'});
    const auth = yield firebase.auth().signInWithCustomToken(response.token);
    yield userCheck();
    yield updateUser(pl({status: 'active', from: 'smsSignup', created: firebaseServerTime()}));
    yield put(buildAction(UI.ADD_NOTIFICATION, 'Account created successfully.'));
    yield put(buildAction(UI.STORE_SIGNUP_NUMBER, null));
    yield put(buildAction(UI.STORE_SIGNUP_KEY, null));
    yield put(buildAction(UI.LOAD_END));
    yield stepCheck();
  } catch (e) {
    console.error(e);
    yield put(buildAction(UI.ADD_NOTIFICATION, {message: e.message || e, level: 'alert'}));
    yield put(buildAction(UI.STORE_SIGNUP_NUMBER, null));
    yield put(buildAction(UI.STORE_SIGNUP_KEY, null));
    yield put(buildAction(UI.LOAD_END));
    yield stepCheck();
  }
}


export function * usePhone () {
  try {
    yield put(buildAction(UI.LOAD_START));
    yield put({type: UI.CLEAR_NOTIFICATIONS});
    yield updateUser(pl({usingPhone: true}));
    yield put(buildAction(UI.ADD_NOTIFICATION, 'Using Phone'));
    yield stepCheck();
    yield put(buildAction(UI.LOAD_END));
  } catch (e) {
    console.error(e);
    yield put(buildAction(UI.LOAD_START));
    yield put(buildAction(UI.ADD_NOTIFICATION, {message: e.message || e, level: 'alert'}));
    yield put(buildAction(UI.LOAD_END));
  }
}

export function * useTwitter (action) {
  try {
    yield put(buildAction(UI.LOAD_START));
    yield put(buildAction(UI.CLEAR_NOTIFICATIONS));
    const { login_url: loginUrl, oauth_token, oauth_token_secret } = yield createRequest('getTwitterLoginUrl', {callback: getTwitterCallback('signup')});
    storage.setItem('twitter_oauth_token', oauth_token);
    storage.setItem('twitter_oauth_token_secret', oauth_token_secret);
    yield put(buildAction(UI.LOAD_END));
    return yield locationHref(pl(loginUrl));
  } catch (e) {
    console.error(e);
    yield put(buildAction(UI.ADD_NOTIFICATION, {message: e.message || e, level: 'alert'}));
    yield put(buildAction(UI.LOAD_END));
  }
}
export function * useInstagram (action) {
  try {
    yield put(buildAction(UI.LOAD_START));
    yield put(buildAction(UI.CLEAR_NOTIFICATIONS));
    const loginUrl = yield createRequest('getInstagramLoginUrl', {callback: getInstagramCallback('signup')});
    yield put(buildAction(UI.LOAD_END));
    return yield locationHref(pl(loginUrl));
  } catch (e) {
    console.error(e);
    yield put(buildAction(UI.ADD_NOTIFICATION, {message: e.message || e, level: 'alert'}));
    yield put(buildAction(UI.LOAD_END));
  }
}

export function * submitAddress (action) {
  try {
    const {firstName, lastName, emailAddress, address1, address2, city, state, postalCode, country} = action.payload;
    const mailingAddress = {firstName, lastName, address1, address2, city, state, postalCode, country};
    yield put(buildAction(UI.LOAD_START));
    yield put(buildAction(UI.CLEAR_NOTIFICATIONS));
    yield updateUser(pl({mailingAddress}));
    yield updateEmail(pl(emailAddress)); // email will require validation
    yield put(buildAction(UI.STORE_SIGNUP_EMAIL, null));
    yield put(buildAction(UI.ADD_NOTIFICATION, 'Mailing address has been updated'));
    yield stepCheck();
    yield put(buildAction(UI.LOAD_END));
  } catch (e) {
    console.error(e);
    yield put(buildAction(UI.ADD_NOTIFICATION, {message: e.message || e, level: 'alert'}));
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
    const { stripeCustomerId } = response;
    yield updateUser(pl({stripeCustomerId}));
    yield put(buildAction(UI.ADD_NOTIFICATION, 'Payment info has been updated'));
    yield stepCheck();
    yield put(buildAction(UI.LOAD_END));
  } catch (e) {
    console.error(e);
    yield put(buildAction(UI.ADD_NOTIFICATION, {message: e.message || e, level: 'alert'}));
    yield put(buildAction(UI.LOAD_END));
  }
}

export default function * (getState) {
  yield [
    //takeEvery(SIGNUP.USER_CHECK, signupUserCheck),
    takeEvery(SIGNUP.CREATE_ACCOUNT, createAccount),
    takeEvery(SIGNUP.SUBMIT_PHONE, submitPhone),
    takeEvery(SIGNUP.RESUBMIT_PHONE, resubmitPhone),
    takeEvery(SIGNUP.CONFIRM_CODE, confirmCode),
    takeEvery(SIGNUP.USE_PHONE, usePhone),
    takeEvery(SIGNUP.USE_INSTAGRAM, useInstagram),
    takeEvery(SIGNUP.USE_TWITTER, useTwitter),
    takeEvery(SIGNUP.SUBMIT_ADDRESS, submitAddress),
    takeEvery(SIGNUP.SUBMIT_PAYMENT, submitPayment),
    takeEvery(SIGNUP.STEP_CHECK, stepCheck)
  ];
}

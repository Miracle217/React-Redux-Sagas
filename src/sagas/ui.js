/* global ga, Rollbar */

import qs from 'qs';
import { takeEvery } from 'redux-saga';
import { call, put, fork, select } from 'redux-saga/effects';
import USER from 'action-types/user';
import UI from 'action-types/ui';
import SELLER from 'action-types/seller';
import TWITTER from 'action-types/twitter';
import CHECKOUT from 'action-types/checkout';
import SIGNUP from 'action-types/signup';
import { attempt, maybe, buildAction, storage, storageGetObject, storageSetObject, delay, firebase, getValue, createRequest, signupRoute, checkoutRoute, loadHubspotForm, checkoutUserRoute, triggerExpressRoute, sellerOnboardingRoute, checkApplePayAvailability, payload as pl } from 'helpers';
import { root, dashboard, signup, receipt, history, contact, checkout, twitterAuthCallback, twitterOptout, checkoutConfirmation, instagramAuthCallback, stripeCallback, verifyEmail, emailLogin, sellerOnboarding, triggerExpress } from 'app/routes';
import { browserHistory } from 'react-router';
import { updateUser, userCheck, fetchCards, fetchReceipts } from './user';
import { signupUserCheck, stepCheck, smsSignup } from './signup';

// TODO: No more putting saga actions from sagas!

// putting a delay between redirects so that they don't run into eachother

export function * historyPush (action) {
  const { payload } = action;
  yield delay(100);
  yield browserHistory.push(payload);
}

export function * historyReplace (action) {
  const { payload } = action;
  yield delay(100);
  yield browserHistory.replace(payload);
}

export function * locationHref (action) {
  const { payload } = action;
  yield delay(100);
  window.location.href = payload;
}

export function * trackAnalytics (state, location, params) {
  ga('send', 'pageview', location.pathname);
}

const CUSTOM_ANALYTICS_HANDLERS = [signup];

// routeCheck should only be run after user check has been done.
export function * routeCheck () {
  const state = yield select();
  const route = state.ui.route;
  const { location, params } = route;
  const { pathname } = location;
  yield handleNoLayout(state, location, params);
  if (CUSTOM_ANALYTICS_HANDLERS.indexOf(pathname) == -1) {
    yield trackAnalytics(state, location, params);
  }

  yield put(buildAction(UI.SET_POWERED_BY, checkoutRoute.match(pathname) || pathname === checkoutConfirmation));
  switch (pathname) {
    case root:
      return yield handleRoot(state, location, params);
    case emailLogin:
      return yield handleNothing(state, location, params);
    case history:
      return yield handleHistory(state, location, params);
    case receipt:
      return yield handleReceipt(state, location, params);
    case dashboard:
      return yield handleDashboard(state, location, params);
    case contact:
      return yield handleContact(state, location, params);
    case signup:
      return yield handleSignup(state, location, params);
    case instagramAuthCallback:
      return yield handleInstagramAuthCallback(state, location, params);
    case twitterAuthCallback:
      return yield handleTwitterAuthCallback(state, location, params);
    case twitterOptout:
      return yield handleTwitterOptout(state, location, params);
    case verifyEmail:
      return yield handleVerifyEmail(state, location, params);
    case checkoutConfirmation:
      return yield handleCheckoutConfirmation(state, location, params);
    case stripeCallback:
      return yield handleStripeCallback(state, location, params);
    case sellerOnboarding:
      return yield handleSellerOnboarding(state, location, params);
  }
  if (signupRoute.match(pathname)) {
    return yield signupUserCheck();
  }
  if (checkoutRoute.match(pathname)) {
    return yield handleCheckout(state, location, params);
  }
  if (checkoutUserRoute.match(pathname)) {
    return yield handleCheckoutUser(state, location, params);
  }
  // TODO: these pages should be handled in a saga, not dispatched from the component
  if (triggerExpressRoute.match(pathname)) {
    return handleNothing(state, location, params);
  }


  // catch-all to check for dynamic urls, or else display error message
  return yield handleDynamicUrl(state, location, params);
}

// just a no-op for ease of reading
function * handleNothing () {
}

function * handleDynamicUrl (state, location, params) {
  try {
    const response = yield getValue(`dynamicURL/${location.pathname}`);
    if (!response){
      yield put(buildAction(UI.LOADING_MESSAGE, 'That page could not be found'));
    }
    // sending to google analytics.
    ga('send', 'event', 'dynamicUrls', 'clicked', `${location.origin}/${response}`, 1);
    return yield historyReplace(pl(response));
  } catch (e) {
    console.error(e);
    yield put(buildAction(UI.LOADING_MESSAGE, 'That page could not be found'));
  }
}

function * handleCheckout (state, locations, { checkoutKey }) {
  try {
    yield put(buildAction(UI.LOAD_START));
    yield put(buildAction(CHECKOUT.ERROR, null));
    const checkout = yield getValue(`expressCheckout/${checkoutKey}`);
    if (!checkout) {
      throw new Error('That shopping cart could not be found. It may have been cancelled or the item may have already been purchased.');
    }
    const hashtag = checkout.hashtag;
    const hashtagInfo = yield getValue(`hashtags/${hashtag}`);
    const { accountId, productId } = hashtagInfo;
    const account = yield getValue(`accounts/${accountId}`);
    const product = yield getValue(`products/${accountId}/${productId}`);

    delete account.stripeCredentials;
    delete account.shopifyCredentials;
    delete account.magentoCredentials;
    delete account.instagramAuth;
    delete account.twitterAuth;

    hashtagInfo.account = account;
    hashtagInfo.product = product;

    storage.setItem('hashtagBranding', JSON.stringify(hashtagInfo));
    const available = yield checkApplePayAvailability();
    console.log('available', available);
    if (available) {
      yield put(buildAction(CHECKOUT.CHECKOUT_PARAMS, {applePay: true}));
    }
    yield put(buildAction(UI.SET_HASHTAG_BRANDING, hashtagInfo));
    yield put(buildAction(CHECKOUT.CHECKOUT_PARAMS, {checkoutId: checkoutKey, account, product, charges: checkout.charges, checkout}));

    yield put(buildAction(UI.SET_POWERED_BY, true));

    yield put(buildAction(UI.LOAD_END));
  } catch (err) {
    console.trace(err);
    yield put(buildAction(CHECKOUT.ERROR, err.message || err));
    yield put(buildAction(UI.SET_POWERED_BY, false));
    yield put(buildAction(UI.LOAD_END));
  }
}

function * handleCheckoutUser (state, location, { checkoutKey }) {
  try {
    yield put(buildAction(UI.LOAD_START));
    yield put(buildAction(CHECKOUT.ERROR, null));
    const checkout = yield getValue(`expressCheckout/${checkoutKey}`);
    if (!checkout) {
      throw new Error('That shopping cart could not be found. It may have been cancelled or the item may have already been purchased.');
    }
    const hashtag = checkout.hashtag;

    yield put(buildAction(CHECKOUT.CHECKOUT_PARAMS, {checkoutId: checkoutKey, hashtag: hashtag}));
    yield put(buildAction(UI.SET_POWERED_BY, true));

    yield put(buildAction(UI.LOAD_END));
  } catch (err) {
    console.trace(err);
    yield put(buildAction(CHECKOUT.ERROR, err.message || err));
    yield put(buildAction(UI.SET_POWERED_BY, false));
    yield put(buildAction(UI.LOAD_END));
  }
}

function * handleCheckoutConfirmation (state, location, params) {
  try {
    yield put(buildAction(UI.LOAD_START));
    const { accountId, transactionId } = location.query;
    const transaction = yield getValue(`transactions/${accountId}/history/${transactionId}`);
    const { productId } = transaction;
    const account = yield getValue(`accounts/${accountId}`);
    const product = yield getValue(`products/${accountId}/${productId}`);

    delete account.stripeCredentials;
    delete account.shopifyCredentials;
    delete account.magentoCredentials;
    delete account.instagramAuth;
    delete account.twitterAuth;

    transaction.account = account;
    transaction.product = product;

    yield put(buildAction(CHECKOUT.CHECKOUT_PARAMS, {transaction, checkoutId: null, charges: null}));
    yield put(buildAction(UI.LOAD_END));
  } catch (err) {
    console.trace(err);
    yield put(buildAction(UI.LOAD_END));
  }
}

function * handleNoLayout(state, location, params) {
  const { query } = location;
  yield put(buildAction(UI.SET_NOLAYOUT, query.nolayout == 'true'));
}

function * handleRoot (state, location, params) {
  const { user, ui } = state;
  let step = null;
  if (!user.data) {
    return;
  }
  if (
    (!user.data.mobileNumber) ||
    //(!user.data.twitterId && !user.data.instagramId && !user.data.usingPhone) ||
    (!user.data.mailingAddress) ||
    (!user.data.stripeCustomerId)
  ) {
    return yield historyReplace(pl(signup));
  }
  return yield historyReplace(pl(dashboard));
}

function * handleContact (state, location, params) {
  yield call(loadHubspotForm, '#hubspot-contact-form');
}

function * handleBranding (state, location, params) {

}

function * handleSellerOnboarding (state, location, params) {
  yield put(buildAction(UI.SET_NOLAYOUT, true));
  const sellerData = storageGetObject('sellerOnboarding');
  if (sellerData) {
    const { accountId, step, productListed, accountPending, paymentStep } = sellerData;
    const account = yield getValue(`accounts/${accountId}`);
    if (account) {
      yield put(buildAction(SELLER.STORE_INFO, {account, step, productListed, accountPending}));
      yield put(buildAction(SELLER.CHANGE_STEP, step));
      if (paymentStep){
        yield put(buildAction(SELLER.CHANGE_PAYMENT_STEP, paymentStep));
      }
    }
  }
}

function * handleHistory (state, location, params) {
  yield put(buildAction(UI.CLEAR_NOTIFICATIONS));
  yield fetchReceipts();
}

function * handleReceipt (state, location, params) {
  yield put(buildAction(UI.CLEAR_NOTIFICATIONS));
  yield fetchReceipts(pl(location.query.receipt));
}

function * handleDashboard (state, location, params) {
  if (!state.user.id) {
    return yield browserHistory.push(root);
  } else if (!isProfileComplete(state.user.data)) {
    return yield browserHistory.push(signup);
  }
  // fetch payment info from stripe
  if (state.user.data.stripeCustomerId) {
    yield fetchCards();
  }
  yield put(buildAction(UI.SET_HASHTAG_BRANDING, null));
  storage.removeItem('hashtagBranding');
}

function * handleSignup (state, location, params) {
  // custom analytics
  const { query, hash, pathname } = location;
  const hashtag = query.h;
  const service = query.s;
  const hashQuery = attempt(() => qs.parse(hash.replace(/^#/, '')));
  const userIdentifier = maybe(hashQuery, 'u') || query.u;
  const signupKey = maybe(hashQuery, 'k') || query.k;
  ga('send', 'pageview', location.pathname, {dimension1: hashtag, dimension2: service, dimension3: userIdentifier});

  if (hashtag) {
    const hashtagInfo = yield getValue(`hashtags/${hashtag}`);
    if (hashtagInfo) {
      const account = yield getValue(`accounts/${hashtagInfo.accountId}`);
      const product = yield getValue(`products/${hashtagInfo.accountId}/${hashtagInfo.productId}`);

      delete account.stripeCredentials;
      delete account.shopifyCredentials;
      delete account.magentoCredentials;
      delete account.instagramAuth;
      delete account.twitterAuth;

      hashtagInfo.account = account;
      hashtagInfo.product = product;

      storage.setItem('hashtagBranding', JSON.stringify(hashtagInfo));

      yield put(buildAction(UI.SET_HASHTAG_BRANDING, hashtagInfo));
    }
  } else {
    const hashtagBranding = storage.getItem('hashtagBranding');
    if (hashtagBranding) {
      try {
        const hashtagInfo = JSON.parse(hashtagBranding);
        yield put(buildAction(UI.SET_HASHTAG_BRANDING, hashtagInfo));
      } catch (err) {
        Rollbar.error(err);
      }
    }
  }

  // sms signup check
  if (service == 'sms' && userIdentifier && signupKey) {
    //yield smsSignup(userIdentifier, signupKey);
    const phoneNumber = '+' + String(userIdentifier).replace(/[^0-9]+/g, '');
    yield put(buildAction(UI.STORE_SIGNUP_NUMBER, phoneNumber));
    yield put(buildAction(UI.STORE_SIGNUP_KEY, signupKey));
  }

  yield stepCheck();
}

function * handleStripeCallback (state, location, params) {
  const { query, hash } = location;
  const { state: accountId, code } = query;
  try {
    yield put(buildAction(UI.LOADING_MESSAGE, 'Please wait while we access your Stripe account.'));
    yield put(buildAction(UI.LOAD_START));
    yield createRequest('createSeller', { accountId, code, step: 3, paymentStep: 2 });
    yield put(buildAction(UI.LOAD_END));
    yield put(buildAction(UI.LOADING_MESSAGE, 'Stripe connected!'));
    yield delay(2000);
    const account = yield getValue(`accounts/${accountId}`);
    yield put(buildAction(SELLER.STORE_INFO, { account, step: 2, infoStep: 2 }));
    yield put(buildAction(SELLER.CHANGE_STEP, 4));
    storageSetObject('sellerOnboarding', {accountId, step: 4, productListed: false, accountPending: true });
    yield historyReplace(pl(sellerOnboarding));
  } catch (e) {
    console.trace(e);
    yield put(buildAction(UI.LOAD_END));
    yield put(buildAction(UI.LOADING_MESSAGE, e.message || e));
    yield delay(2000);
    const account = yield getValue(`accounts/${accountId}`);
    yield put(buildAction(SELLER.STORE_INFO,  { account, step: 2, paymentStep: 2 }));
    yield put(buildAction(SELLER.CHANGE_STEP, 3));
    yield historyReplace(pl(sellerOnboarding));
  }
}

function * handleInstagramAuthCallback (state, location, params) {
  try {
    const { query, hash } = location;
    const { action } = query;
    yield put(buildAction(UI.LOAD_START));
    yield put(buildAction(UI.LOADING_MESSAGE, 'Please wait while we access your Instagram account.'));
    const accessTokenMatch = hash.match(/access_token=([^&]+)/);
    if (!accessTokenMatch) {
      return;
    }
    const accessToken = accessTokenMatch[1];
    /* eslint-disable camelcase */
    const {user_id, screen_name, username, access_token, avatar, customAuthToken} = yield createRequest('getInstagramAuthInfo', {access_token: accessToken, action});
    /* eslint-enable camelcase */
    yield put(buildAction(UI.LOADING_MESSAGE, 'Please wait while we access your Instagram account.'));
    if (action == 'login') {
      if (!customAuthToken) {
        throw new Error('Could not login user');
      }
      const auth = yield firebase.auth().signInWithCustomToken(customAuthToken);

      yield put(buildAction(UI.LOADING_MESSAGE, 'User logged in'));
      yield put(buildAction(UI.LOAD_END));
      yield delay(2000);
      yield userCheck();
      return yield postLogin();
    } else if (action == 'signup') {
      /* eslint-disable camelcase */
      yield updateUser(pl({instagramId: user_id, instagramAuth: {screen_name, username, access_token, avatar}}));
      /* eslint-enable camelcase */
      yield put(buildAction(UI.LOADING_MESSAGE, 'Account verified!'));
      yield put(buildAction(UI.LOAD_END));
      yield delay(2000);
      return yield historyReplace(pl(signup));
    } else if (action == 'dashboard') {
      /* eslint-disable camelcase */
      yield updateUser(pl({instagramId: user_id, instagramAuth: {screen_name, username, access_token, avatar}}));
      /* eslint-enable camelcase */
      yield put(buildAction(UI.LOADING_MESSAGE, 'Account verified!'));
      yield put(buildAction(UI.LOAD_END));
      yield delay(2000);
      return yield historyReplace(pl(dashboard));
    } else if (action === 'seller') {
      const sellerData = storageGetObject('sellerOnboarding');
      if (sellerData) {
        const { accountId } = sellerData;
        const account = yield getValue(`accounts/${accountId}`);
        if (!account) {
          throw new Error('Account not found');
        }
        /* eslint-disable camelcase */
        yield createRequest('setInstagramAuthInfo', {accountId: accountId, instagramId: user_id, instagramAuth: {screen_name, username, access_token, avatar}});
        /* eslint-enable camelcase */
        yield put(buildAction(UI.LOAD_END));
        yield delay(2000);
        return yield historyReplace(pl(sellerOnboarding));
      }
    }
  } catch (e) {
    console.trace(e);
    const { query } = location;
    const { action } = query;
    yield put(buildAction(UI.LOAD_END));
    yield put(buildAction(UI.LOADING_MESSAGE, e.message));
    yield delay(2000);
    yield historyReplace(pl(action === 'signup' ? signup : action === 'dashboard' ? dashboard : action === 'seller' ? sellerOnboarding : root));
  }
}

function * handleTwitterOptout (state, location, params) {
  const { query } = location;
  const { action } = query;
  try {
    yield put(buildAction(TWITTER.OPTOUT_PARAMS, {complete: false, checking: true}));
    const { t: twitterId, c: code } = query;
    if (!twitterId || !code) {
      throw new Error('Could not identify twitter user');
    }
    const blacklistSnap = yield firebase.child(`blacklist/twitter/${twitterId}`);
    const optedOut = blacklistSnap.val();
    yield put(buildAction(TWITTER.OPTOUT_PARAMS, {twitterId, code, optedOut, checking: false}));
  } catch (err) {
    console.trace(err);
    yield put(buildAction(TWITTER.OPTOUT_PARAMS, {error: err.message || err, checking: false}));
    yield delay(2000);
    yield historyReplace(pl(action == 'signup' ? signup : action == 'dashboard' ? dashboard : root));
  }
}

function * handleTwitterAuthCallback (state, location, params) {
  try {
    const { query } = location;
    yield put(buildAction(UI.LOAD_START));
    yield put(buildAction(UI.LOADING_MESSAGE, 'Please wait while we access your twitter account.'));
    /* eslint-disable camelcase */
    const { action, oauth_verifier } = query;

    const oauth_token = storage.getItem('twitter_oauth_token');
    const oauth_token_secret = storage.getItem('twitter_oauth_token_secret');
    storage.removeItem('twitter_oauth_token');
    storage.removeItem('twitter_oauth_token_secret');

    const {user_id, screen_name, username, oauth_access_token, oauth_access_token_secret, avatar, customAuthToken} = yield createRequest('getTwitterAuthInfo', {oauth_token, oauth_token_secret, oauth_verifier, action});
    /* eslint-enable camelcase */

    if (action == 'login') {
      if (!customAuthToken) {
        throw new Error('Could not login user');
      }
      const auth = yield firebase.auth().signInWithCustomToken(customAuthToken);
      yield put(buildAction(UI.LOADING_MESSAGE, 'User logged in'));
      yield put(buildAction(UI.LOAD_END));
      yield delay(2000);
      yield userCheck();
      return yield postLogin();
    } else if (action == 'signup') {
      /* eslint-disable camelcase */
      yield updateUser(pl({twitterId: user_id, twitterAuth: {screen_name, username,  oauth_access_token, oauth_access_token_secret, avatar}}));
      /* eslint-enable camelcase */
      yield put(buildAction(UI.LOADING_MESSAGE, 'Account verified!'));
      yield put(buildAction(UI.LOAD_END));
      yield delay(2000);
      return yield historyReplace(pl(signup));
    } else if (action == 'dashboard') {
      /* eslint-disable camelcase */
      yield updateUser(pl({twitterId: user_id, twitterAuth: {screen_name, username,  oauth_access_token, oauth_access_token_secret, avatar}}));
      /* eslint-enable camelcase */
      yield put(buildAction(UI.LOADING_MESSAGE, 'Account verified!'));
      yield put(buildAction(UI.LOAD_END));
      yield delay(2000);
      return yield historyReplace(pl(dashboard));
    } else if (action === 'seller') {
      const sellerData = storageGetObject('sellerOnboarding');
      if (sellerData) {
        const { accountId, step } = sellerData;
        const account = yield getValue(`accounts/${accountId}`);
        if (account) {
          yield put(buildAction(SELLER.STORE_INFO, {account, step}));
          yield put(buildAction(SELLER.CHANGE_STEP, step));
        }
      }
    }
    return yield historyReplace(pl(root));
  } catch (e) {
    console.trace(e);
    const { query } = location;
    const { action } = query;
    yield put(buildAction(UI.LOAD_END));
    yield put(buildAction(UI.LOADING_MESSAGE, e.message));
    yield delay(2000);
    yield historyReplace(pl(action == 'signup' ? signup : action == 'dashboard' ? dashboard : root));
  }
}

function * loadHashtag (action) {
  const hashtag = action.payload.hashtag;
  // if there is a product then pull the product
  const hashtagSnapshot = yield firebase.child(`hashtags/${hashtag}`).once('value');
  const hashtagInfo = hashtagSnapshot.val();

  if (hashtagInfo && hashtagInfo.productId) {
    const productSnapshot = yield firebase.child(`products/${hashtagInfo.accountId}/${hashtagInfo.productId}`).once('value');
    hashtagInfo.product = productSnapshot.val();
  }

  yield put(buildAction(UI.LOADED_HASHTAG, hashtagInfo));
}

function * handleVerifyEmail (state, location, params) {
  try {
    yield put(buildAction(UI.LOADING_MESSAGE, 'Please wait while we verify your email Address.'));
    const { query } = location;
    const { userId, emailVerificationCode } = query;
    const response = yield createRequest('verifyEmail', {userId, emailVerificationCode});

    const auth = yield firebase.auth().signInWithCustomToken(response.token);
    yield userCheck();
    yield put(buildAction(UI.LOADING_MESSAGE, 'Email verified!'));
    yield delay(3000);
    yield postLogin();
  } catch (e) {
    yield put(buildAction(UI.LOADING_MESSAGE, 'Error: ' + e.message));
    yield delay(3000);
    yield historyReplace(pl(root));
  }
}

function isProfileComplete (data) {
  return data.mailingAddress && data.stripeCustomerId;
}

export function * routeMounted (action) {
  ga('send', 'pageview');
  const {location, params} = action.payload;
  const { pathname } = location;
  const { provider } = params;

  if (pathname.indexOf('twitter') !== -1){
    return yield put(buildAction(TWITTER.TWITTER_CALLBACK, {location, params}));
  }

  yield put(buildAction(UI.SET_ROUTE, action.payload));
  const state = yield select();
  if (!state.user.checked) {
    yield userCheck();
  }
  yield routeCheck();
}

export function * postLogin () {
  try {
    let step;
    const state = yield select();
    const user = state && state.user && state.user.data;
    if (!user) {
      // this really shouldn't ever happen;
      return;
    }
    // if profile is not complete, go directly to signup
    if (!user.mobileNumber) {
      step = 'phoneNumber';
//    } else if (!user.instagramId && !user.twitterId && !user.usingPhone) {
//      step = 'socialMedia';
    } else if (!user.mailingAddress) {
      step = 'mailingAddress';
    } else if (!user.stripeCustomerId) {
      step = 'payment';
    } else {
      return yield historyReplace(pl(root));
    }
    return yield historyReplace(pl(signupRoute.reverse({step})));
  } catch (e) {
    console.trace(e);
    return yield historyReplace(pl(root));
  }
}

export default function * (getState) {
  yield [
    //takeEvery(UI.LOCATION_HREF, locationHref),
    takeEvery(UI.ROUTE_MOUNTED, routeMounted),
    takeEvery(UI.LOAD_HASHTAG, loadHashtag),
    //takeEvery(UI.ROUTE_CHECK, routeCheck),
    takeEvery(UI.HISTORY_PUSH, historyPush)
    //takeEvery(UI.HISTORY_REPLACE, historyReplace),
    //takeEvery(UI.POST_LOGIN, postLogin)
  ];
}

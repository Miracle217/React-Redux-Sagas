/* global Rollbar */
'use strict';

import { takeEvery } from 'redux-saga';
import { call, put, fork, select, take } from 'redux-saga/effects';
import { buildAction, createRequest, delay, buildApplePaySession, applePayCompletion, createToken, payload as pl } from 'helpers';
import CHECKOUT from 'action-types/checkout';
import UI from 'action-types/ui';
import { historyPush } from 'sagas/ui';

function * autocomplete ({ payload }) {
  const { address1, city, state, postalCode, country } = payload;

  const updateForm = (field, value) => put({type: 'redux-form/CHANGE', payload: value, meta: {form: 'expressCheckout', field}});

  yield updateForm('address1', address1);
  yield updateForm('city', city);
  yield updateForm('state', state);
  yield updateForm('postalCode', postalCode);
  yield updateForm('country', country);
}

function * submitForm ({ payload: { values, resolve, reject } }) {
  try {
    const { checkout } = yield select();
    const { checkoutParams: { checkoutId } } = checkout;
    yield put(buildAction(UI.LOAD_START));
    yield put(buildAction(UI.CLEAR_NOTIFICATIONS));
    const { number, ccv, expMonth, expYear, zip } = values;
    const { firstName = null, lastName = null, address1 = null, emailAddress = null, state = null, city = null, postalCode = null, country = null } = values;
    const address2 = values.address2 || null;
    const mailingAddress = { firstName, lastName, address1, address2, state, city, postalCode, country };
    const stripeToken = yield createToken({number, cvc: ccv, expMonth, expYear, address_zip: zip});
    const response = yield createRequest('expressCheckout', {stripeToken, emailAddress, checkoutId, mailingAddress});
    yield put(buildAction(UI.ADD_NOTIFICATION, response.message));
    yield put(buildAction(UI.LOAD_END));
    yield historyPush(pl(`/checkoutConfirmation.html?accountId=${response.accountId}&transactionId=${response.transactionId}`));
    resolve();
  } catch (err) {
    Rollbar.error(err);
    yield put(buildAction(UI.ADD_NOTIFICATION, {level: 'alert', message: err.message || err}));
    yield put(buildAction(UI.LOAD_END));
    reject();
  }
}

function * applePay ({ payload: { values, resolve, reject } }) {
  try {
    const { checkout } = yield select();
    const { checkoutParams: { checkoutId, account, product, charges} } = checkout;
    yield put(buildAction(UI.LOAD_START));
    yield put(buildAction(UI.CLEAR_NOTIFICATIONS));
    const paymentInfo = {
      countryCode: 'US',
      currencyCode: 'USD',
      total: {
        label: account.name,
        amount: ((charges.price + charges.shipping + charges.tax) / 100).toFixed(2)
      },
      lineItems: [
        {
          label: product.title,
          amount: charges.price.toFixed(2),
          type: "final"
        },
        {
          label: "Shipping",
          amount: charges.shipping.toFixed(2),
          type: "final"
        },
        {
          label: "Tax",
          amount: charges.tax.toFixed(2),
          type: "final"
        }
      ],
      // TODO: Do this correctly
      requiredShippingContactFields: product.type === 'Donation' ? [] : [
        "postalAddress",
        "name",
        "phone",
        "email"
      ]
    };
    const { result, completion } = yield buildApplePaySession(paymentInfo);
    let response;
    try {
      response = yield createRequest('applePay', { checkoutId, result });
      Rollbar.info({a:'rr',response});
    } catch (err) {
      completion(false);
      throw err;
    }
    completion(true);
    yield put(buildAction(UI.ADD_NOTIFICATION, 'Apple Pay payment completed'));
    yield put(buildAction(UI.LOAD_END));
    yield historyPush(pl(`/checkoutConfirmation.html?accountId=${response.accountId}&transactionId=${response.transactionId}`));
  } catch (err) {
    Rollbar.error(err);
    yield put(buildAction(UI.ADD_NOTIFICATION, {level: 'alert', message: err.message || err}));
    yield put(buildAction(UI.LOAD_END));
    reject();
  }
}
function * submitNumber (data) {
  const { checkout } = yield select();
  const { checkoutParams: { checkoutId, hashtag } } = checkout;

  try {
    yield put(buildAction(UI.LOAD_START));
    yield put(buildAction(UI.CLEAR_NOTIFICATIONS));
    if (hashtag){
      if (data.confirmationRequired){
        let formSubmitted = true;
        const response = yield createRequest('checkoutUser', {mobileNumber: data.mobileNumber, hashtag: hashtag, confirmationRequired:true});
        if (response.result){
          formSubmitted = false;
        }
        yield [
          put(buildAction(CHECKOUT.NUMBER_CONFIRMATION, {isPhoneExist: response.result, formSubmitted: formSubmitted} )),
          put(buildAction(UI.LOAD_END))
        ];
      } else {
        const response = yield createRequest('checkoutUser', {mobileNumber: data.mobileNumber, hashtag: hashtag, confirmationRequired:false});
        if (response.result){
          yield [
            put(buildAction(CHECKOUT.SUBMIT_CHECKOUT_FORM, {isPhoneExist: data.isPhoneExist})),
            put(buildAction(UI.LOAD_END))
          ];
        } else {
          yield [
            put(buildAction(UI.ADD_NOTIFICATION, {message: response.result, level: 'alert'})),
            put(buildAction(UI.LOAD_END))
          ];
        }
      }
    } else {
      yield [
        put(buildAction(UI.ADD_NOTIFICATION, {message: 'Link has been expired. Please try again with another tweet', level: 'alert'})),
        put(buildAction(UI.LOAD_END))
      ];
    }

  } catch (err) {
    yield put(buildAction(UI.ADD_NOTIFICATION, {message: err.message || err, level: 'alert'}));
    console.log(err);
  }
}

export default function * combineCheckout () {
  yield [
    takeEvery(CHECKOUT.AUTOCOMPLETE, autocomplete),
    takeEvery(CHECKOUT.SUBMIT_FORM, submitForm),
    takeEvery(CHECKOUT.SUBMIT_NUMBER, submitNumber),
    takeEvery(CHECKOUT.APPLE_PAY, applePay)
  ];
}

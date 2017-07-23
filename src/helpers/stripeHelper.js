'use strict';

/* global Stripe */

import { stripePublishableKey } from 'config';

if (typeof Stripe === 'undefined') {
  let script = document.createElement('script');
  script.src = 'https://js.stripe.com/v2/';
  script.type = 'text/javascript';
  document.head.appendChild(script);
}

let registered = false;

const ensurePublishable = () => {
  if (typeof Stripe === 'undefined') {
    throw new Error('Stripe library not loaded');
  }
  if (registered) {
    return Promise.resolve();
  }

  Stripe.setPublishableKey(stripePublishableKey);
  registered = true;
  return Promise.resolve();
};

export const createToken = (cardInfo) => ensurePublishable().then(() =>
  new Promise((resolve, reject) => Stripe.card
    .createToken(cardInfo, (status, response) => {
      if (response.error) {
        reject(response.error.message);
      }
      resolve(response.id);
    })
  )
);

export const checkApplePayAvailability = () => ensurePublishable().then(() =>
  new Promise((resolve, reject) => Stripe.applePay.checkAvailability(resolve))
);

export const buildApplePaySession = (paymentInfo) => ensurePublishable().then(() => {
  return new Promise((resolve, reject) => {
    const session = Stripe.applePay.buildSession(paymentInfo, (result, completion) => {
      resolve({ result, completion });
    }, (err) => {
      reject(err)
    });

    session.oncancel = function() {
      console.log("User hit the cancel button in the payment window");
      reject(new Error("Apple pay canceled."));
    };

    session.begin();
  });
});

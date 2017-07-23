import React from 'react';
import { reduxForm } from 'redux-form';
import { AddressFields, PaymentFields, DonationEmail } from 'components/form';
import { NotificationList } from 'components/common';
import { formDispatcher, formatPrice } from 'helpers';

export function ExpressCheckoutForm ({form, action, handleSubmit, notifications, product, autocompleteAction, buttonText, applePayStripeToken, ...props}) {

  return (
    <form className="boost-app-form signup-form" onSubmit={handleSubmit(formDispatcher(action))}>
      <NotificationList notifications={notifications} />
      <div className="form-padding">
        <div>
          <h6>enter your payment information</h6>
          {
            product && product.type === 'Donation' ? (
              <DonationEmail />
            ) : null
          }
          {
            !applePayStripeToken && <PaymentFields  />
          }
          {
            product && product.type === 'Donation' ? (
              <div>
                <input type="submit" className="form-button" value={buttonText} />
              </div>
            ) : null

          }
        </div>
        {
          !product || product.type != 'Donation' ? (
            <div >
              <h6>enter your shipping address</h6>
              <AddressFields autocompleteAction={autocompleteAction} />
              <input type="submit" className="form-button" value={buttonText} />
            </div>
          ) : null
        }
        <p className="helper-text">By submitting this form and information, I am agreeing to allow Boost to create a Boost account for me so that I can buy or donate faster in the future.  I also agree to Boost’s <a href="https://boo.st/terms.html">Terms of Use</a></p>
      </div>
    </form>
  );
}

export default reduxForm({
  form: 'expressCheckout'
})(ExpressCheckoutForm);

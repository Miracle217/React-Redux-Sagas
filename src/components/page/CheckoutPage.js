import React from 'react';

import classNames from 'classnames';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { ExpressCheckoutForm } from 'components/form';
import { Loading, NotificationList } from 'components/common';
import { buildAction, formDispatcher, setRef, eventDecorator, maybe, formatPrice } from 'helpers';
import { reduxForm } from 'redux-form';
import CHECKOUT from 'action-types/checkout';

function CheckoutPage ({user, branding, params, error, dispatch}) {
  const product = params.product;
  const imageUrl = maybe(params.checkout, 'imageUrl') || maybe(branding, 'product', 'imageUrl');

  let title = maybe(params.checkout, 'productName');
  if (!title) {
    title = maybe(branding, 'product', 'title');
  }
  else if (maybe(params.checkout, 'title')) {
    title = `${title} - ${maybe(params.checkout, 'title')}`;
  }

  const description = maybe(params.checkout, 'description') || maybe(branding, 'product', 'description');
  const taxesShipping = !product || product.type !== 'Donation' ? (
    <div>
      <div className="row">
        <span className="price-label">Taxes</span>
        <span className="price pull-right">{formatPrice((maybe(params, 'charges', 'tax') || 0) / 100)}</span>
      </div>
      <div className="row">
        <span className="price-label">Shipping</span>
        <span className="price pull-right">{formatPrice((maybe(params, 'charges', 'shipping') || 0) / 100)}</span>
      </div>
    </div>
  ) : null;

  const applePayButton = params.applePay === true ? (
    <button onClick={() => dispatch(buildAction(CHECKOUT.APPLE_PAY))} id="apple-pay-button" />
  ) : null;

  return error ? (
    <div>
      <Loading />
      <div>
        <div className="header">
          <h1 className="header">Cart not found</h1>
          <h4 className="text-center">{error}</h4>
        </div>
        <p className="text-center">Please <Link to="/">log in or sign up</Link> to start boosting.</p>
      </div>
    </div>
  ) : (
    <div className="checkout-form">
      <Loading />
      <div className="checkout-top">
        <div className="product-image" onClick={eventDecorator(() => dispatch(buildAction(CHECKOUT.CHECKOUT_PARAMS, {expandDescription: !params.expandDescription})))}>
          <div className={classNames({'product-caption': true, collapsed: !params.expandDescription})}> {/* todo: toggle collapsed class on .expander click */}
            <div className={classNames({hide: !description, expander: true})}><i className={classNames({fa : true, 'fa-align-left' : !params.expandDescription, 'fa-times' : params.expandDescription })} /></div>
           <div className="product-caption-title">{title}</div>
           <div className="product-description">{description}</div>
          </div>
          <img src={imageUrl} /> {/* todo: product photo */}
        </div>
        <div className={classNames({'price-container': true, collapsed: !params.expandPrice})}>
          <div className="price-supplemental">
            <div className="row">
              <span className="price-label">Price</span>
              <span className="price pull-right">{formatPrice((maybe(params, 'charges', 'price') || 0) / 100)}</span>
            </div>
              {taxesShipping}
          </div>
          <div className="row">
            <span className="price-label">Total</span>
            <span className="price-button pull-right" onClick={eventDecorator(() => dispatch(buildAction(CHECKOUT.CHECKOUT_PARAMS, {expandPrice: !params.expandPrice})))}>{formatPrice(
              (
                (Number(maybe(params, 'charges', 'price')) || 0) +
                (Number(maybe(params, 'charges', 'shipping')) || 0) +
                (Number(maybe(params, 'charges', 'tax')) || 0)
              ) / 100
            )}&nbsp;<div className={classNames({fa : true, 'fa-angle-down' : !params.expandPrice, 'fa-angle-up' : params.expandPrice})} /></span>
          </div>
        </div>
      </div>

      <div className="form-container">
          {applePayButton}
          {
            product && product.type === 'Donation' ? (
              <ExpressCheckoutForm form="expressCheckout" product={maybe(branding, 'product')} initialValues={{country: 'US'}} buttonText={'Donate ' + formatPrice(
                (
                  (Number(maybe(params, 'charges', 'price')) || 0)
                ) / 100
              )} autocompleteAction={CHECKOUT.AUTOCOMPLETE} onSubmit={formDispatcher(CHECKOUT.SUBMIT_FORM)} action={CHECKOUT.SUBMIT_FORM}/>
            ) : (
              <ExpressCheckoutForm form="expressCheckout" product={maybe(branding, 'product')} initialValues={{country: 'US'}} applePayStripeToken={maybe(params, 'applePayStripeToken')} buttonText={(maybe(branding, 'product', 'type') === 'Donation' ? 'Donate ' :  'complete order for ') + formatPrice(
                (
                  (Number(maybe(params, 'charges', 'price')) || 0) +
                  (Number(maybe(params, 'charges', 'shipping')) || 0) +
                  (Number(maybe(params, 'charges', 'tax')) || 0)
                ) / 100
              )} autocompleteAction={CHECKOUT.AUTOCOMPLETE} onSubmit={formDispatcher(CHECKOUT.SUBMIT_FORM)} action={CHECKOUT.SUBMIT_FORM}/>
            )
          }
      </div>
    </div>
  );
}

export default connect(state => ({
  user: state.user,
  params: state.checkout.checkoutParams,
  error: state.checkout.error,
  notifications: state.ui.notifications,
  step: state.ui.route.params.step,
  branding: state.ui.hashtagBranding
}))(CheckoutPage);

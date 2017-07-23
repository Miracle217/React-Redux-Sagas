'use strict';
import React, { Component, PropTypes } from 'react';
import StripeLink from 'components/common/StripeLink';
import { connect } from 'react-redux';
import NotificationList from 'components/common/NotificationList';
import Loading from 'components/common/Loading';
import { stripeCallback } from 'app/routes';
import CreditCardNumber from 'components/common/CreditCardNumber';
import MonthSelector from 'components/common/MonthSelector';
import YearSelector from 'components/common/YearSelector';
import SELLER from 'action-types/seller';
import buildAction from 'helpers/buildAction';

let number, ccv, expMonth, expYear, addressZip;
const startYear = new Date().getFullYear();
const endYear = startYear + 31;

export class SellerPaymentMethod extends Component {
  static propTypes = {
    account: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  constructor(props, context) {
    super(props, context);
    this.onSubmit = this.onSubmit.bind(this);
  }
  onSubmit(e) {
    e.preventDefault();
    const { dispatch } = this.props;
    const cardInfo = {
      number: number.value,
      cvc: ccv.value,
      exp_month: expMonth.value,
      exp_year: expYear.value,
      address_zip: addressZip.value
    };
    dispatch(buildAction( SELLER.SUBMIT_SUBSCRIPTION, cardInfo: cardInfo));
  }

  render () {
    const { account } = this.props;
    const formStepIndicator = (
      <ul className="steps form-step subscription-step">
        <li className={this.props.paymentStep === 1 ? 'on' : 'complete'}>subscribe</li>
        <li className={this.props.paymentStep === 2 ? 'on' : ''}>get paid</li>
      </ul>
    );

    const stripeForm = (
      <div>
        <p className="helper-text">
          Payments are powered by <strong>stripe</strong>&mdash;trusted by brands like Adidas, Best Buy, and… the Girl Scouts. It’s free (and easy) to set up.
        </p>
        <div className="btn btn-primary text-center col-sm-12">
          <StripeLink className="form-button" callback={stripeCallback} accountKey={account.__key__} />
        </div>
      </div>
    );

    return (
      <div>
        <Loading />
        <NotificationList notifications={this.props.notifications} />
        <div className="header small">
          <div>
            <div className="status-badge">
              <i className="fa fa-clock-o" />
              <div className="status-readout">
                account pending
              </div>
            </div>
          </div>
          <h1>
            your account has been created!
          </h1>
        </div>
        <div className="form-container seller subscription-container">

          {formStepIndicator}

          <form className="signup-form boost-app-form" action=""onSubmit={this.onSubmit}>
            {this.props.paymentStep === 2 ? stripeForm :
              <div className="subscription-block-container">
                <div className="subscription-block">
                  <div className="subscription-cost">
                    $29<p>per month</p>
                  </div>
                  <h3 className="subscription__header">14-Day Free Trial*</h3>
                  <ul className="subscription-features">
                    <li className="subscription-features__item">
                      Sell with a hashtag via Instagram, Twitter, and SMS
                    </li>
                    <li className="subscription-features__item">
                      Low transaction fees (3.5% +30¢)
                    </li>
                    <li className="subscription-features__item">
                      No commitments or contracts
                    </li>
                  </ul>
                </div>
                <div className="subscription-block subscription-form">
                  <CreditCardNumber id="cc-number" ref={r => number = r} type="tel" name="cardNumber" inputMode="numeric" />
                  <input id="cc-ccv" ref={r => ccv = r} type="number" placeholder="Security Code" title="Security Code" pattern="[0-9]*" inputMode="numeric" required />
                  <MonthSelector id="expMonth" ref={r => expMonth = r} monthType="numeric" required />
                  <YearSelector id="expYear" ref={r => expYear = r} startYear={startYear} endYear={endYear} required />
                  <input id="postalCode" ref={r => addressZip = r} type="number" pattern="[0-9]*" inputMode="numeric" placeholder="Zip Code" required />
                  <input className="form-button" type="submit" value="Start your subscription" />
                  <p className="subscription-text"><i className="fa fa-lock icon"></i>&nbsp;Powered By Stripe</p>
                </div>
              </div>
              }
          </form>
          <p className="subscription-text">*Transaction fees apply during free trial.</p>
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  notification: state.ui.notifications,
  paymentStep: state.seller.paymentStep
}))(SellerPaymentMethod);

'use strict';

import React from 'react';
import { connect } from 'react-redux';
import buildAction from 'helpers/buildAction';
import SIGNUP from 'action-types/signup';

import CreditCardNumber from 'components/common/CreditCardNumber';
import MonthSelector from 'components/common/MonthSelector';
import YearSelector from 'components/common/YearSelector';

const PaymentEntry = ({dispatchSubmitPayment}) => {
  let number, ccv, expMonth, expYear, addressZip;

  const startYear = new Date().getFullYear();
  const endYear = startYear + 31;

  const onSubmit = e => {
    e.preventDefault();
    const cardInfo = {
      number: number.value,
      cvc: ccv.value,
      exp_month: expMonth.value,
      exp_year: expYear.value,
      address_zip: addressZip.value
    };
    dispatchSubmitPayment(cardInfo);
  };

  return (
    <div>
      <form onSubmit={onSubmit}  className="boost-app-form signup-form">
        <h6>enter your payment information</h6>
        <CreditCardNumber id="cc-number" ref={r => number = r} type="tel" name="cardNumber" inputMode="numeric" />
        <input id="cc-ccv" ref={r => ccv = r} type="number" placeholder="Security Code" title="Security Code" pattern="[0-9]*" inputMode="numeric" required />
        <MonthSelector id="expMonth" ref={r => expMonth = r} monthType="numeric" required />
        <YearSelector id="expYear" ref={r => expYear = r} startYear={startYear} endYear={endYear} required />
        <input id="postalCode" ref={r => addressZip = r} type="number" pattern="[0-9]*" inputMode="numeric" placeholder="Zip Code" required />
        <input className="form-button" type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default connect(state => ({}), dispatch => ({
  dispatchSubmitPayment: cardInfo => dispatch(buildAction(SIGNUP.SUBMIT_PAYMENT, cardInfo))
}))(PaymentEntry);

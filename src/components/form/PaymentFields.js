import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { initAutocomplete } from 'helpers';
import { CreditCardNumber, MonthSelector, YearSelector } from 'components/common';

const startYear = new Date().getFullYear();
const endYear = startYear + 31;

export function PaymentFields ({ ...restProps }) {
  const { meta, ...props } = restProps;
  return (
    <div>
      <Field name="number" className="field cc-number" component={CreditCardNumber} type="tel"  placeholder="Credit Card Number" required />
      <Field name="ccv" className="field cc-ccv" component="input" type="tel"  placeholder="Security Code" pattern="[0-9]*" inputMode="numeric" required />
      <Field name="expMonth" className="field expMonth" component={MonthSelector} monthType="numeric" required />
      <Field name="expYear" className="field expYear" component={YearSelector} startYear={startYear} endYear={endYear} required />
      <Field name="zip" className="field postalCode" component="input" type="number" pattern="[0-9]*" inputMode="numeric" placeholder="Zip Code" required />
    </div>
  );
}

export default (PaymentFields);

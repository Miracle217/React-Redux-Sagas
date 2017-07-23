import React from 'react';
import { Field } from 'redux-form';

export function DonationEmail ({ ...restProps }) {
  const { meta, ...props } = restProps;
  return (
    <div>
      <Field name="firstName" className="field firstName" component="input" type="text" placeholder="First Name" required />
      <Field name="lastName" className="field lastName" component="input" type="text" placeholder="Last Name" required />
      <Field name="emailAddress" className="field emailAddress" component="input" type="email" placeholder="Email Address" required />
    </div>
  );
}

export default (DonationEmail);

import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { initAutocomplete } from 'helpers';
import { CountrySelector, GoogleMapsAutocomplete } from 'components/common';

export function AddressFields ({ autocompleteAction, ...restProps }) {
  const { meta, ...props } = restProps;
  return (
    <div>
      <Field name="firstName" className="field firstName" component="input" type="text" placeholder="First Name" required />
      <Field name="lastName" className="field lastName" component="input" type="text" placeholder="Last Name" required />
      <Field name="emailAddress" className="field emailAddress" component="input" type="email" placeholder="Email Address" required />
      <Field name="address1" className="field address1" action={autocompleteAction} component={GoogleMapsAutocomplete} type="text" placeholder="Enter Address" autoComplete="off" required />
      <Field name="address2" className="field address2" component="input" type="text" placeholder="Address Line 2" autoComplete="off" />
      <Field name="city" className="field city" component="input" type="text" placeholder="City" required />
      <Field name="state" className="field state" component="input" type="text" placeholder="State" required />
      <Field name="postalCode" className="field postalCode" component="input" type="text" placeholder="Zip Code" required />
      <Field name="country" className="field country" component={CountrySelector} type="text" placeholder="Country" required />
    </div>
  );
}

export default (AddressFields);

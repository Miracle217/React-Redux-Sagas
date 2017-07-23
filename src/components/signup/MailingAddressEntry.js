'use strict';

import React from 'react';
import { connect } from 'react-redux';

import SIGNUP from 'action-types/signup';
import buildAction from 'helpers/buildAction';
import CountrySelector from 'components/common/CountrySelector';
import { initAutocomplete } from 'helpers/googleAutocomplete';
import InputText from 'components/common/InputText';

const MailingAddressEntry = ({user, ui, dispatchSubmitAddress}) => {
  if (!user) {
    user = {};
  }
  let { mailingAddress } = user;
  if (!mailingAddress) {
    mailingAddress = {};
  }
  let autoComplete, firstName, lastName, emailAddress, address1, address2, city, state, postalCode, country;

  const onSubmit = (e) => {
    e.preventDefault();
    const address = {
      firstName: firstName.value,
      lastName: lastName.value,
      emailAddress: emailAddress.value,
      address1: address1.value,
      address2: address2.value || null,
      city: city.value,
      state: state.value,
      postalCode: postalCode.value,
      country: country.value
    };
    dispatchSubmitAddress(address);
  };

  // defer this post-render
  Promise.resolve().then(() => {
    if (!address1) {
      return;
    }
    initAutocomplete(address1.getInput()).then(ac => {
      autoComplete = ac;
      autoComplete.on('autocomplete', data => {
        // TODO: figure out why this is null sometimes
        if (!address1) {
          return;
        }
        address1.value = data.address1;
        city.value = data.city;
        state.value = data.state;
        postalCode.value = data.postalCode;
        country.value = data.country;
      });
    });
  });

  return (
    <div>
      <form onSubmit={onSubmit} className="boost-app-form signup-form">
        <h6>enter your shipping address</h6>
        <InputText id="firstName" type="text" ref={r => firstName = r} placeholder="First Name" required value={mailingAddress.firstName} />
        <InputText id="lastName" type="text" ref={r => lastName = r} placeholder="Last Name"  required value={mailingAddress.lastName} />
        <InputText id="emailAddress" type="email" ref={r => emailAddress = r} placeholder="Email address" required value={user.pendingEmail || user.email || ui.signupEmail} />
        <InputText id="address1" type="text" ref={r => address1 = r} placeholder="Enter address" autoComplete="off" required value={mailingAddress.address1} />
        <InputText id="address2" type="text" ref={r => address2 = r} placeholder="Address Line 2" autoComplete="off" value={mailingAddress.address2} />
        <InputText id="city" type="text" ref={r => city = r} placeholder="City" required value={mailingAddress.city} />
        <InputText id="state" type="text" ref={r => state = r} placeholder="State" required value={mailingAddress.state} />
        <InputText id="postalCode" type="text" ref={r => postalCode = r} placeholder="Zip Code" required value={mailingAddress.postalCode} />
        <CountrySelector id="country" ref={r => country = r} required value={mailingAddress.country} />
        <input className="form-button" type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default connect(state => ({
  ui: state.ui,
  user: state.user && state.user.data
}), dispatch => ({
  dispatchSubmitAddress: address => dispatch(buildAction(SIGNUP.SUBMIT_ADDRESS, address))
}))(MailingAddressEntry);

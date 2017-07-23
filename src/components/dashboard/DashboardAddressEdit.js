'use strict';

import React, { Component,  PropTypes } from 'react';
import { connect } from 'react-redux';
import InputText from 'components/common/InputText';
import { initAutocomplete} from 'helpers/googleAutocomplete';
import DASHBOARD from 'action-types/dashboard';
import buildAction from 'helpers/buildAction';

import Loading from 'components/common/Loading';
import NotificationList from 'components/common/NotificationList';
import CountrySelector from 'components/common/CountrySelector';

export const DashboardAddressEdit = ({user, dispatchSubmitAddress}) => {
  if (!user) {
    return null;
  }
  let autoComplete, firstName, lastName, emailAddress, address1, address2, city, state, postalCode, country;
  const { mailingAddress } = user || {mailingAddress:{}};
  const onSubmit = e => {
    e.preventDefault();
    const address = {
      firstName: firstName.value,
      lastName: lastName.value,
      address1: address1.value,
      address2: address2.value || null,
      city: city.value,
      state: state.value,
      postalCode: postalCode.value,
      country: country.value
    };
    dispatchSubmitAddress(address);
  };

  if (!mailingAddress) {
    return null;
  }

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
    <div className="setting-block full">
      <Loading />
      <NotificationList filter="mailingAddress" />
      <div className="setting-block-inner">
        <form onSubmit={onSubmit}>
          <h3 className="no-margin">Address</h3>
          <div className="form-subheader">
            Your Buying &amp; Shipping Address must be the same
          </div>
          <div className="row collapse space30">
            <div className="small-12 columns">
                <InputText type="text" id="firstName" ref={r => firstName = r} placeholder="First Name" required value={mailingAddress.firstName} />
                <InputText type="text" id="lastName" ref={r => lastName = r} placeholder="Last Name"  required value={mailingAddress.lastName} />
            </div>
          </div>
          <div className="row collapse">
            <div className="small-12 columns">
                <InputText type="text" id="address1" ref={r => address1 = r} placeholder="Enter address" autoComplete="off" required value={mailingAddress.address1} />
            </div>
          </div>
          <div className="row collapse">
            <div className="small-12 columns">
              <InputText type="text" id="address2" ref={r => address2 = r} placeholder="Address Line 2" autoComplete="off" value={mailingAddress.address2} />
            </div>
          </div>
          <div className="row collapse">
            <div className="small-6 medium-4 columns">
              <InputText type="text" id="city" ref={r => city = r} placeholder="City" required value={mailingAddress.city} />
            </div>
            <div className="small-6 medium-4 columns">
              <InputText type="text" id="" ref={r => state = r} placeholder="State" required value={mailingAddress.state} />
            </div>
            <div className="small-12 medium-4 columns">
              <InputText  type="text" id="" ref={r => postalCode = r} placeholder="Zip Code" required value={mailingAddress.postalCode} />
            </div>
            <div className="small-12 columns">
              <CountrySelector ref={r => country = r} required value={mailingAddress.country} />
            </div>
          </div>
          <br />
          <div className="row text-center">
            <button type="submit" className="form-button small">Save Address Info</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default connect(null, dispatch => ({
  dispatchSubmitAddress: mailingAddress => dispatch(buildAction(DASHBOARD.SUBMIT_ADDRESS, mailingAddress))
}))(DashboardAddressEdit);

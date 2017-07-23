'use strict';

import React, { PropTypes } from 'react';
import ReactTelInput from 'react-telephone-input';
import { connect } from 'react-redux';
import DASHBOARD from 'action-types/dashboard';
import { buildAction, setRef } from 'helpers';
import Loading from 'components/common/Loading';
import NotificationList from 'components/common/NotificationList';
import { onlyCountries } from 'helpers/telInputHelper';

const DashboardPhoneNumberEdit = ({user, dashboardNumber, dispatchSubmitPhone, dispatchConfirmCode}) => {
  if (!user) {
    return null;
  }
  const refs = {};
  const onSubmit = (e) => {
    e.preventDefault();
    const number = refs.phoneNumber.getInstance().getValue();
    const code = refs.confirmationCode.value;
    if (number == dashboardNumber) {
      dispatchConfirmCode(code);
    } else {
      dispatchSubmitPhone(number);
    }
  };
  const shown = {display: dashboardNumber ? 'block' : 'none'};
  return (
    <div className="setting-block">
      <Loading />
      <NotificationList filter="phoneNumber" />
      <div className="setting-block-inner">
        <form onSubmit={onSubmit}>
          <h3 className="no-margin">Phone Number</h3>
          <div className="form-subheader">
            Enter request token to authorize new phone number
          </div>
          <div className="row collapse">
            <div className="medium-12 columns">
              <ReactTelInput
                ref={setRef(refs, 'phoneNumber')}
                placeholder="Phone Number"
                required type="tel"
                value={dashboardNumber || user.mobileNumber}
                flagsImagePath="/images/flags.png"
                defaultCountry="us"
                onlyCountries={onlyCountries} />
            </div>
            <div className="medium-12 columns" style={shown}>
              <input  ref={setRef(refs, 'confirmationCode')} placeholder="Confirmation Code" required={false} type="text" defaultValue="" />
            </div>
            <div className="medium-12 columns text-center">
              <input type="submit" className="form-button primary" value={dashboardNumber ? 'Confirm Code' : 'Send Request Token'}/>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default connect(state => ({
  dashboardNumber: state.ui.dashboardNumber
}), dispatch => ({
  dispatchSubmitPhone: phoneNumber => dispatch(buildAction(DASHBOARD.SUBMIT_PHONE, phoneNumber)),
  dispatchConfirmCode: (code) => dispatch(buildAction(DASHBOARD.CONFIRM_CODE, code))
}))(DashboardPhoneNumberEdit);

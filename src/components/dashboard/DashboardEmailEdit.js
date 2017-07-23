'use strict';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import InputText from 'components/common/InputText';
import DASHBOARD from 'action-types/dashboard';
import buildAction from 'helpers/buildAction';
import Loading from 'components/common/Loading';
import NotificationList from 'components/common/NotificationList';

const DashboardEmailEdit = ({user, dispatchChangeEmail}) => {
  if (!user) {
    return null;
  }
  let emailAddress;
  const onSubmit = e => {
    e.preventDefault();
    dispatchChangeEmail(emailAddress.value);
  };
  const onResend = e => {
    e.preventDefault();
    dispatchChangeEmail(user.pendingEmail);
  };
  const subheader = (user.pendingEmail && !user.emailVerified) ? <span>Email is not verified. <a onClick={onResend}>Resend</a> verification.</span> : null;
  return (
    <div className="setting-block">
      <Loading />
      <NotificationList filter="email" />
      <div className="setting-block-inner">
        <form onSubmit={onSubmit}>
          <h3 className="no-margin">Email Address</h3>
          <div className="form-subheader">
            {subheader}
          </div>
          <div className="row collapse">
            <div className="medium-12 medium-centered columns">
              <InputText placeholder="Email Address" ref={r => emailAddress = r} required type="email" value={user.pendingEmail || user.email} />
            </div>
          </div>
          <div className="row text-center">
            <button type="submit" className="form-button primary">Save Email Address</button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default connect(null, dispatch => ({
  dispatchChangeEmail: email => dispatch(buildAction(DASHBOARD.SUBMIT_EMAIL, email))
}))(DashboardEmailEdit);

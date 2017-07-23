import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import UI from 'action-types/ui';
import USER from 'action-types/user';
import { setRef, buildAction } from 'helpers';
import InputText from 'components/common/InputText';

import Loading from './Loading';
import NotificationList from './NotificationList';

const EmailLogin = ({ui, user, email, dispatch, dispatchEmailLogin, dispatchEmailLoginConfirm }) => {
  const refs = {};
  const onSubmit = (e) => {
    e.preventDefault();
    let email, confirmationCode;
    if (refs.email) {
      email = refs.email.value;
    }
    if (refs.confirmationCode) {
      confirmationCode = refs.confirmationCode.value;
    }
    if (!email) {
      return false;
    }
    if (confirmationCode && email == ui.loginEmail) {
      dispatchEmailLoginConfirm(email, confirmationCode);
    } else {
      dispatchEmailLogin(email);
    }
  };

  const onResendClick = (e) => {
    if (!ui.expandedLogin) {
      return;
    }
    e.stopPropagation();
    const email = refs.email.value;
    if (!email) {
      dispatch(buildAction(UI.STORE_LOGIN_EMAIL, null));
      dispatch(buildAction(UI.COLLAPSE_LOGIN));
    }
    dispatchEmailLogin(email);
  };

  const onChangeEmailClick = (e) => {
    if (!ui.expandedLogin) {
      return;
    }
    e.stopPropagation();
    dispatch(buildAction(UI.STORE_LOGIN_EMAIL, null));
    dispatch(buildAction(UI.COLLAPSE_LOGIN));
  };

  const confirmationCodeStyle = {display: ui.expandedLogin ? 'block' : 'none' };

  return (
    <form onSubmit={onSubmit} action="" className="phoneNumber" method="post" acceptCharset="utf-8">
      <div className="form-container">
        <Loading />
        <NotificationList notifications={ui.notifications} />
        <div className="signup-form">
          <h6>ENTER EMAIL ADDRESS</h6>
          <InputText id="emailAddress" type="email" ref={setRef(refs, 'email')} placeholder="Email address" value={ui.loginEmail}/>
          <input style={confirmationCodeStyle} ref={setRef(refs, 'confirmationCode')} type="number" inputMode="numeric"  pattern="[0-9]*" placeholder="Login Code" className="form-control" id="requestTokenField" />
          <input type="submit" value={ui.expandedLogin ? 'log in' : 'send me a login code'} className="form-button"/>
          <div className="text-center">
            <a className="secondary-link" onClick={onResendClick}>{ui.expandedLogin ? 'Resend login code' : ''}</a>
            <a className="secondary-link" onClick={onChangeEmailClick}>{ui.expandedLogin ? 'Send to a different email' : ''}</a>
          </div>
        </div>
      </div>
    </form>
  );
};

export default connect(state => ({
  ui: state.ui,
  user: state.user && state.user.data
}), dispatch => ({
  dispatch: dispatch,
  dispatchEmailLogin: (email) => dispatch(buildAction(USER.EMAIL_LOGIN, {email})),
  dispatchEmailLoginConfirm: (email, code) => dispatch(buildAction(USER.EMAIL_LOGIN_CONFIRM, {email, code}))
}))(EmailLogin);
